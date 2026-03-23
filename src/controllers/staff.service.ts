import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import { AcademicYear } from "../models/academic-year.entity";
import { ClassTeacher } from "../models/class-teacher.entity";
import { GradeSubject } from "../models/grade-subject.entity";
import { School } from "../models/school.entity";
import {
	AssignClassTeacherDto,
	AssignSubjectTeacherDto,
	CreateStaffDto,
	CreateStaffResponseDto,
	StaffDto,
	UpdateStaffDto,
} from "../models/staff.dto";
import { Staff } from "../models/staff.entity";
import { Stream } from "../models/stream.entity";
import { SubjectTeacher } from "../models/subject-teacher.entity";
import { UserAccount } from "../models/user-account.entity";

@Injectable()
export class StaffService {
	constructor(
		@InjectRepository(Staff)
		private readonly staffRepo: Repository<Staff>,
		@InjectRepository(School)
		private readonly schoolRepo: Repository<School>,
		@InjectRepository(UserAccount)
		private readonly userAccountRepo: Repository<UserAccount>,
		@InjectRepository(ClassTeacher)
		private readonly classTeacherRepo: Repository<ClassTeacher>,
		@InjectRepository(SubjectTeacher)
		private readonly subjectTeacherRepo: Repository<SubjectTeacher>,
		@InjectRepository(Stream)
		private readonly streamRepo: Repository<Stream>,
		@InjectRepository(GradeSubject)
		private readonly gradeSubjectRepo: Repository<GradeSubject>,
		@InjectRepository(AcademicYear)
		private readonly academicYearRepo: Repository<AcademicYear>,
	) {}

	async findAll(schoolId: string): Promise<StaffDto[]> {
		return plainToInstance(
			StaffDto,
			await this.staffRepo.find({
				where: { school: { id: schoolId } },
				relations: ["userAccount"],
				order: { lastName: "ASC" },
			}),
			{ excludeExtraneousValues: true },
		);
	}

	async findOne(id: string): Promise<StaffDto> {
		const staff = await this.staffRepo.findOne({
			where: { id },
			relations: [
				"school",
				"userAccount",
				"classTeacherAssignments",
				"classTeacherAssignments.stream",
				"classTeacherAssignments.stream.gradeLevel",
				"classTeacherAssignments.academicYear",
				"subjectTeacherAssignments",
				"subjectTeacherAssignments.gradeSubject",
				"subjectTeacherAssignments.gradeSubject.subject",
				"subjectTeacherAssignments.stream",
				"subjectTeacherAssignments.academicYear",
			],
		});
		if (!staff) throw new NotFoundException(`Staff ${id} not found`);
		return plainToInstance(StaffDto, staff, { excludeExtraneousValues: true });
	}

	async findByRole(schoolId: string, role: string): Promise<StaffDto[]> {
		return plainToInstance(
			StaffDto,
			await this.staffRepo.find({
				where: { schoolId, role },
				order: { lastName: "ASC" },
			}),
			{ excludeExtraneousValues: true },
		);
	}

	async create(dto: CreateStaffDto): Promise<CreateStaffResponseDto> {
		const school = await this.schoolRepo.findOne({
			where: { id: dto.schoolId },
		});
		if (!school)
			throw new NotFoundException(`School ${dto.schoolId} not found`);

		const emailTaken = await this.staffRepo.findOne({
			where: { email: dto.email },
		});
		if (emailTaken)
			throw new ConflictException(`Email ${dto.email} is already in use`);

		const staff = this.staffRepo.create({ school, ...dto });
		const savedStaff = await this.staffRepo.save(staff);

		const tempPassword = `${dto.firstName.toLowerCase()}@${Math.floor(1000 + Math.random() * 9000)}`;
		const passwordHash = await bcrypt.hash(tempPassword, 10);

		const userAccount = this.userAccountRepo.create({
			email: dto.email,
			passwordHash,
			role: dto.role,
			isActive: true,
			staff: savedStaff,
		});
		await this.userAccountRepo.save(userAccount);

		return plainToInstance(
			CreateStaffResponseDto,
			{ ...savedStaff, TempPassword: tempPassword },
			{ excludeExtraneousValues: true },
		);
	}

	async update(id: string, dto: UpdateStaffDto): Promise<StaffDto> {
		const staff = await this.staffRepo.findOne({
			where: { id },
			relations: ["school", "userAccount"],
		});
		if (!staff) throw new NotFoundException(`Staff ${id} not found`);
		Object.assign(staff, dto);
		return plainToInstance(StaffDto, await this.staffRepo.save(staff), {
			excludeExtraneousValues: true,
		});
	}

	async deactivate(id: string): Promise<StaffDto> {
		const staff = await this.staffRepo.findOne({
			where: { id },
			relations: ["userAccount"],
		});
		if (!staff) throw new NotFoundException(`Staff ${id} not found`);
		staff.status = "inactive";
		if (staff.userAccount) {
			staff.userAccount.isActive = false;
			await this.userAccountRepo.save(staff.userAccount);
		}
		return plainToInstance(StaffDto, await this.staffRepo.save(staff), {
			excludeExtraneousValues: true,
		});
	}

	// ── Class teacher assignment ──────────────────────────────────────────────

	async assignClassTeacher(dto: AssignClassTeacherDto): Promise<ClassTeacher> {
		const staff = await this.staffRepo.findOne({ where: { id: dto.staffId } });
		if (!staff) throw new NotFoundException(`Staff ${dto.staffId} not found`);

		const stream = await this.streamRepo.findOne({
			where: { id: dto.streamId },
		});
		if (!stream)
			throw new NotFoundException(`Stream ${dto.streamId} not found`);

		const academicYear = await this.academicYearRepo.findOne({
			where: { id: dto.academicYearId },
		});
		if (!academicYear)
			throw new NotFoundException(
				`Academic year ${dto.academicYearId} not found`,
			);

		const existing = await this.classTeacherRepo.findOne({
			where: {
				stream: { id: dto.streamId },
				academicYear: { id: dto.academicYearId },
			},
			relations: ["staff"],
		});
		if (existing) {
			throw new ConflictException(
				`${existing.staff.firstName} ${existing.staff.lastName} is already the class teacher for this stream this year`,
			);
		}

		const assignment = this.classTeacherRepo.create({
			staff,
			stream,
			academicYear,
		});
		return this.classTeacherRepo.save(assignment);
	}

	async removeClassTeacher(id: string): Promise<void> {
		const assignment = await this.classTeacherRepo.findOne({ where: { id } });
		if (!assignment)
			throw new NotFoundException(`Class teacher assignment ${id} not found`);
		await this.classTeacherRepo.remove(assignment);
	}

	// ── Subject teacher assignment ────────────────────────────────────────────

	async assignSubjectTeacher(
		dto: AssignSubjectTeacherDto,
	): Promise<SubjectTeacher> {
		const staff = await this.staffRepo.findOne({ where: { id: dto.staffId } });
		if (!staff) throw new NotFoundException(`Staff ${dto.staffId} not found`);

		const gradeSubject = await this.gradeSubjectRepo.findOne({
			where: { id: dto.gradeSubjectId },
			relations: ["subject", "gradeLevel"],
		});
		if (!gradeSubject)
			throw new NotFoundException(
				`Grade subject ${dto.gradeSubjectId} not found`,
			);

		const stream = await this.streamRepo.findOne({
			where: { id: dto.streamId },
		});
		if (!stream)
			throw new NotFoundException(`Stream ${dto.streamId} not found`);

		const academicYear = await this.academicYearRepo.findOne({
			where: { id: dto.academicYearId },
		});
		if (!academicYear)
			throw new NotFoundException(
				`Academic year ${dto.academicYearId} not found`,
			);

		const existing = await this.subjectTeacherRepo.findOne({
			where: {
				gradeSubject: { id: dto.gradeSubjectId },
				stream: { id: dto.streamId },
				academicYear: { id: dto.academicYearId },
			},
		});
		if (existing) {
			throw new ConflictException(
				`A teacher is already assigned to this subject in this stream for this year`,
			);
		}

		const assignment = this.subjectTeacherRepo.create({
			staff,
			gradeSubject,
			stream,
			academicYear,
		});
		return this.subjectTeacherRepo.save(assignment);
	}

	async removeSubjectTeacher(id: string): Promise<void> {
		const assignment = await this.subjectTeacherRepo.findOne({ where: { id } });
		if (!assignment)
			throw new NotFoundException(`Subject teacher assignment ${id} not found`);
		await this.subjectTeacherRepo.remove(assignment);
	}
}
