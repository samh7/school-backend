import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import { AcademicYear } from "../models/academic-year.entity";
import { Stream } from "../models/stream.entity";
import {
	BulkRolloverDto,
	CreateEnrollmentDto,
	EnrollmentDto,
	UpdateEnrollmentDto,
} from "../models/student-enrollment.dto";
import { StudentEnrollment } from "../models/student-enrollment.entity";
import { Student } from "../models/student.entity";
import { Term } from "../models/term.entity";

@Injectable()
export class StudentEnrollmentService {
	constructor(
		@InjectRepository(StudentEnrollment)
		private readonly enrollmentRepo: Repository<StudentEnrollment>,
		@InjectRepository(Student)
		private readonly studentRepo: Repository<Student>,
		@InjectRepository(Stream)
		private readonly streamRepo: Repository<Stream>,
		@InjectRepository(AcademicYear)
		private readonly academicYearRepo: Repository<AcademicYear>,
		@InjectRepository(Term)
		private readonly termRepo: Repository<Term>,
	) {}

	async findByStudent(studentId: string): Promise<EnrollmentDto[]> {
		return plainToInstance(
			EnrollmentDto,
			await this.enrollmentRepo.find({
				where: { student: { id: studentId } },
				relations: ["stream", "stream.gradeLevel", "academicYear", "term"],
				order: { enrollmentDate: "DESC" },
			}),
			{ excludeExtraneousValues: true },
		);
	}

	async findByStream(
		streamId: string,
		termId: string,
	): Promise<EnrollmentDto[]> {
		return plainToInstance(
			EnrollmentDto,
			await this.enrollmentRepo.find({
				where: {
					stream: { id: streamId },
					term: { id: termId },
					status: "active",
				},
				relations: ["student"],
				order: { student: { lastName: "ASC" } },
			}),
			{ excludeExtraneousValues: true },
		);
	}

	async findCurrent(studentId: string): Promise<EnrollmentDto> {
		const enrollment = await this.enrollmentRepo.findOne({
			where: { student: { id: studentId }, status: "active" },
			relations: ["stream", "stream.gradeLevel", "academicYear", "term"],
		});
		if (!enrollment)
			throw new NotFoundException(
				`No active enrollment found for student ${studentId}`,
			);
		return plainToInstance(EnrollmentDto, enrollment, {
			excludeExtraneousValues: true,
		});
	}

	async findOne(id: string): Promise<EnrollmentDto> {
		const enrollment = await this.enrollmentRepo.findOne({
			where: { id },
			relations: [
				"student",
				"stream",
				"stream.gradeLevel",
				"academicYear",
				"term",
			],
		});
		if (!enrollment) throw new NotFoundException(`Enrollment ${id} not found`);
		return plainToInstance(EnrollmentDto, enrollment, {
			excludeExtraneousValues: true,
		});
	}

	async enroll(dto: CreateEnrollmentDto): Promise<EnrollmentDto> {
		const student = await this.studentRepo.findOne({
			where: { id: dto.studentId },
		});
		if (!student)
			throw new NotFoundException(`Student ${dto.studentId} not found`);

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

		const term = await this.termRepo.findOne({ where: { id: dto.termId } });
		if (!term) throw new NotFoundException(`Term ${dto.termId} not found`);

		const duplicate = await this.enrollmentRepo.findOne({
			where: { student: { id: dto.studentId }, term: { id: dto.termId } },
		});
		if (duplicate)
			throw new ConflictException(`Student is already enrolled for this term`);

		const enrollment = this.enrollmentRepo.create({
			enrollmentDate: dto.enrollmentDate,
			status: "active",
			student,
			stream,
			academicYear,
			term,
		});
		return plainToInstance(
			EnrollmentDto,
			await this.enrollmentRepo.save(enrollment),
			{ excludeExtraneousValues: true },
		);
	}

	async update(id: string, dto: UpdateEnrollmentDto): Promise<EnrollmentDto> {
		const enrollment = await this.enrollmentRepo.findOne({
			where: { id },
			relations: [
				"student",
				"stream",
				"stream.gradeLevel",
				"academicYear",
				"term",
			],
		});
		if (!enrollment) throw new NotFoundException(`Enrollment ${id} not found`);
		Object.assign(enrollment, dto);
		return plainToInstance(
			EnrollmentDto,
			await this.enrollmentRepo.save(enrollment),
			{ excludeExtraneousValues: true },
		);
	}

	async bulkRollover(
		dto: BulkRolloverDto,
	): Promise<{ Enrolled: number; Skipped: number }> {
		const toTerm = await this.termRepo.findOne({ where: { id: dto.toTermId } });
		if (!toTerm) throw new NotFoundException(`Term ${dto.toTermId} not found`);

		const toAcademicYear = await this.academicYearRepo.findOne({
			where: { id: dto.academicYearId },
		});
		if (!toAcademicYear)
			throw new NotFoundException(
				`Academic year ${dto.academicYearId} not found`,
			);

		const previous = await this.enrollmentRepo.find({
			where: { term: { id: dto.fromTermId }, status: "completed" },
			relations: ["student", "stream"],
		});

		let enrolled = 0;
		let skipped = 0;

		for (const prev of previous) {
			const alreadyEnrolled = await this.enrollmentRepo.findOne({
				where: { student: { id: prev.student.id }, term: { id: dto.toTermId } },
			});
			if (alreadyEnrolled) {
				skipped++;
				continue;
			}

			const newEnrollment = this.enrollmentRepo.create({
				enrollmentDate: new Date(),
				status: "active",
				student: prev.student,
				stream: prev.stream,
				academicYear: toAcademicYear,
				term: toTerm,
			});
			await this.enrollmentRepo.save(newEnrollment);
			enrolled++;
		}

		return { Enrolled: enrolled, Skipped: skipped };
	}

	async completeTermEnrollments(termId: string): Promise<{ Updated: number }> {
		const result = await this.enrollmentRepo.update(
			{ term: { id: termId }, status: "active" },
			{ status: "completed" },
		);
		return { Updated: result.affected ?? 0 };
	}
}
