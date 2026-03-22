import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { School } from "../Models/1.SchoolEntity";
import { ClassTeacher } from "../Models/10.ClassTeacherEntity";
import { UserAccount } from "../Models/13.UserAccountEntity";
import { AcademicYear } from "../Models/2.AcademicYearEntity";
import { Stream } from "../Models/5.StreamEntity";
import {
	AssignClassTeacherDto,
	AssignSubjectTeacherDto,
	CreateStaffDto,
	UpdateStaffDto,
} from "../Models/7.StaffDto";
import { Staff } from "../Models/7.StaffEntity";
import { GradeSubject } from "../Models/8.GradeSubjectEntity";
import { SubjectTeacher } from "../Models/9.SubjectTeacherEntity";

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

	async findAll(schoolId: string): Promise<Staff[]> {
		return this.staffRepo.find({
			where: { School: { Id: schoolId } },
			relations: ["UserAccount"],
			order: { LastName: "ASC" },
		});
	}

	async findOne(id: string): Promise<Staff> {
		const staff = await this.staffRepo.findOne({
			where: { Id: id },
			relations: [
				"School",
				"UserAccount",
				"ClassTeacherAssignments",
				"ClassTeacherAssignments.Stream",
				"ClassTeacherAssignments.Stream.GradeLevel",
				"ClassTeacherAssignments.AcademicYear",
				"SubjectTeacherAssignments",
				"SubjectTeacherAssignments.GradeSubject",
				"SubjectTeacherAssignments.GradeSubject.Subject",
				"SubjectTeacherAssignments.Stream",
				"SubjectTeacherAssignments.AcademicYear",
			],
		});
		if (!staff) throw new NotFoundException(`Staff ${id} not found`);
		return staff;
	}

	async findByRole(schoolId: string, role: string): Promise<Staff[]> {
		return this.staffRepo.find({
			where: { School: { Id: schoolId }, Role: role, Status: "active" },
			order: { LastName: "ASC" },
		});
	}

	async create(dto: CreateStaffDto): Promise<Staff & { TempPassword: string }> {
		const school = await this.schoolRepo.findOne({
			where: { Id: dto.SchoolId },
		});
		if (!school)
			throw new NotFoundException(`School ${dto.SchoolId} not found`);

		const emailTaken = await this.staffRepo.findOne({
			where: { Email: dto.Email },
		});
		if (emailTaken)
			throw new ConflictException(`Email ${dto.Email} is already in use`);

		const staff = this.staffRepo.create({
			School: school,
			...dto,
		});
		const savedStaff = await this.staffRepo.save(staff);

		// Auto-create UserAccount with a temporary password
		const tempPassword = `${dto.FirstName.toLowerCase()}@${Math.floor(1000 + Math.random() * 9000)}`;
		const passwordHash = await bcrypt.hash(tempPassword, 10);

		const userAccount = this.userAccountRepo.create({
			Email: dto.Email,
			PasswordHash: passwordHash,
			Role: dto.Role,
			IsActive: true,
			Staff: savedStaff,
		});
		await this.userAccountRepo.save(userAccount);

		return { ...savedStaff, TempPassword: tempPassword };
	}

	async update(id: string, dto: UpdateStaffDto): Promise<Staff> {
		const staff = await this.findOne(id);
		Object.assign(staff, dto);
		return this.staffRepo.save(staff);
	}

	async deactivate(id: string): Promise<Staff> {
		const staff = await this.findOne(id);
		staff.Status = "inactive";
		if (staff.UserAccount) {
			staff.UserAccount.IsActive = false;
			await this.userAccountRepo.save(staff.UserAccount);
		}
		return this.staffRepo.save(staff);
	}

	// ── Class teacher assignment ──────────────────────────────────────────────

	async assignClassTeacher(dto: AssignClassTeacherDto): Promise<ClassTeacher> {
		const staff = await this.staffRepo.findOne({ where: { Id: dto.StaffId } });
		if (!staff) throw new NotFoundException(`Staff ${dto.StaffId} not found`);

		const stream = await this.streamRepo.findOne({
			where: { Id: dto.StreamId },
		});
		if (!stream)
			throw new NotFoundException(`Stream ${dto.StreamId} not found`);

		const academicYear = await this.academicYearRepo.findOne({
			where: { Id: dto.AcademicYearId },
		});
		if (!academicYear)
			throw new NotFoundException(
				`Academic year ${dto.AcademicYearId} not found`,
			);

		const existing = await this.classTeacherRepo.findOne({
			where: {
				Stream: { Id: dto.StreamId },
				AcademicYear: { Id: dto.AcademicYearId },
			},
			relations: ["Staff"],
		});
		if (existing) {
			throw new ConflictException(
				`${existing.Staff.FirstName} ${existing.Staff.LastName} is already the class teacher for this stream this year`,
			);
		}

		const assignment = this.classTeacherRepo.create({
			Staff: staff,
			Stream: stream,
			AcademicYear: academicYear,
		});
		return this.classTeacherRepo.save(assignment);
	}

	async removeClassTeacher(id: string): Promise<void> {
		const assignment = await this.classTeacherRepo.findOne({
			where: { Id: id },
		});
		if (!assignment)
			throw new NotFoundException(`Class teacher assignment ${id} not found`);
		await this.classTeacherRepo.remove(assignment);
	}

	// ── Subject teacher assignment ────────────────────────────────────────────

	async assignSubjectTeacher(
		dto: AssignSubjectTeacherDto,
	): Promise<SubjectTeacher> {
		const staff = await this.staffRepo.findOne({ where: { Id: dto.StaffId } });
		if (!staff) throw new NotFoundException(`Staff ${dto.StaffId} not found`);

		const gradeSubject = await this.gradeSubjectRepo.findOne({
			where: { Id: dto.GradeSubjectId },
			relations: ["Subject", "GradeLevel"],
		});
		if (!gradeSubject)
			throw new NotFoundException(
				`Grade subject ${dto.GradeSubjectId} not found`,
			);

		const stream = await this.streamRepo.findOne({
			where: { Id: dto.StreamId },
		});
		if (!stream)
			throw new NotFoundException(`Stream ${dto.StreamId} not found`);

		const academicYear = await this.academicYearRepo.findOne({
			where: { Id: dto.AcademicYearId },
		});
		if (!academicYear)
			throw new NotFoundException(
				`Academic year ${dto.AcademicYearId} not found`,
			);

		const existing = await this.subjectTeacherRepo.findOne({
			where: {
				GradeSubject: { Id: dto.GradeSubjectId },
				Stream: { Id: dto.StreamId },
				AcademicYear: { Id: dto.AcademicYearId },
			},
		});
		if (existing) {
			throw new ConflictException(
				`A teacher is already assigned to this subject in this stream for this year`,
			);
		}

		const assignment = this.subjectTeacherRepo.create({
			Staff: staff,
			GradeSubject: gradeSubject,
			Stream: stream,
			AcademicYear: academicYear,
		});
		return this.subjectTeacherRepo.save(assignment);
	}

	async removeSubjectTeacher(id: string): Promise<void> {
		const assignment = await this.subjectTeacherRepo.findOne({
			where: { Id: id },
		});
		if (!assignment)
			throw new NotFoundException(`Subject teacher assignment ${id} not found`);
		await this.subjectTeacherRepo.remove(assignment);
	}
}
