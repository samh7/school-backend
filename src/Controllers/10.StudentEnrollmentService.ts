import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "../Models/11.StudentEntity";
import { BulkRolloverDto, CreateEnrollmentDto, UpdateEnrollmentDto } from "../Models/12.StudentEnrollmentDto";
import { StudentEnrollment } from "../Models/12.StudentEnrollmentEntity";
import { AcademicYear } from "../Models/2.AcademicYearEntity";
import { Term } from "../Models/3.TermEntity";
import { Stream } from "../Models/5.StreamEntity";

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
	) { }

	async findByStudent(studentId: string): Promise<StudentEnrollment[]> {
		return this.enrollmentRepo.find({
			where: { Student: { Id: studentId } },
			relations: ['Stream', 'Stream.GradeLevel', 'AcademicYear', 'Term'],
			order: { EnrollmentDate: 'DESC' },
		});
	}

	async findByStream(streamId: string, termId: string): Promise<StudentEnrollment[]> {
		return this.enrollmentRepo.find({
			where: { Stream: { Id: streamId }, Term: { Id: termId }, Status: 'active' },
			relations: ['Student'],
			order: { Student: { LastName: 'ASC' } },
		});
	}

	async findCurrent(studentId: string): Promise<StudentEnrollment> {
		const enrollment = await this.enrollmentRepo.findOne({
			where: { Student: { Id: studentId }, Status: 'active' },
			relations: ['Stream', 'Stream.GradeLevel', 'AcademicYear', 'Term'],
		});
		if (!enrollment) throw new NotFoundException(`No active enrollment found for student ${studentId}`);
		return enrollment;
	}

	async findOne(id: string): Promise<StudentEnrollment> {
		const enrollment = await this.enrollmentRepo.findOne({
			where: { Id: id },
			relations: ['Student', 'Stream', 'Stream.GradeLevel', 'AcademicYear', 'Term'],
		});
		if (!enrollment) throw new NotFoundException(`Enrollment ${id} not found`);
		return enrollment;
	}

	async enroll(dto: CreateEnrollmentDto): Promise<StudentEnrollment> {
		const student = await this.studentRepo.findOne({ where: { Id: dto.StudentId } });
		if (!student) throw new NotFoundException(`Student ${dto.StudentId} not found`);

		const stream = await this.streamRepo.findOne({ where: { Id: dto.StreamId } });
		if (!stream) throw new NotFoundException(`Stream ${dto.StreamId} not found`);

		const academicYear = await this.academicYearRepo.findOne({ where: { Id: dto.AcademicYearId } });
		if (!academicYear) throw new NotFoundException(`Academic year ${dto.AcademicYearId} not found`);

		const term = await this.termRepo.findOne({ where: { Id: dto.TermId } });
		if (!term) throw new NotFoundException(`Term ${dto.TermId} not found`);

		const duplicate = await this.enrollmentRepo.findOne({
			where: { Student: { Id: dto.StudentId }, Term: { Id: dto.TermId } },
		});
		if (duplicate) throw new ConflictException(`Student is already enrolled for this term`);

		const enrollment = this.enrollmentRepo.create({
			EnrollmentDate: dto.EnrollmentDate,
			Status: 'active',
			Student: student,
			Stream: stream,
			AcademicYear: academicYear,
			Term: term,
		});
		return this.enrollmentRepo.save(enrollment);
	}

	async update(id: string, dto: UpdateEnrollmentDto): Promise<StudentEnrollment> {
		const enrollment = await this.findOne(id);
		Object.assign(enrollment, dto);
		return this.enrollmentRepo.save(enrollment);
	}

	async bulkRollover(dto: BulkRolloverDto): Promise<{ Enrolled: number; Skipped: number; }> {
		const toTerm = await this.termRepo.findOne({ where: { Id: dto.ToTermId } });
		if (!toTerm) throw new NotFoundException(`Term ${dto.ToTermId} not found`);

		const toAcademicYear = await this.academicYearRepo.findOne({ where: { Id: dto.AcademicYearId } });
		if (!toAcademicYear) throw new NotFoundException(`Academic year ${dto.AcademicYearId} not found`);

		const previous = await this.enrollmentRepo.find({
			where: { Term: { Id: dto.FromTermId }, Status: 'completed' },
			relations: ['Student', 'Stream'],
		});

		let enrolled = 0;
		let skipped = 0;

		for (const prev of previous) {
			// Skip if already enrolled in the target term
			const alreadyEnrolled = await this.enrollmentRepo.findOne({
				where: { Student: { Id: prev.Student.Id }, Term: { Id: dto.ToTermId } },
			});
			if (alreadyEnrolled) { skipped++; continue; }

			const newEnrollment = this.enrollmentRepo.create({
				EnrollmentDate: new Date(),
				Status: 'active',
				Student: prev.Student,
				Stream: prev.Stream,
				AcademicYear: toAcademicYear,
				Term: toTerm,
			});
			await this.enrollmentRepo.save(newEnrollment);
			enrolled++;
		}

		return { Enrolled: enrolled, Skipped: skipped };
	}

	async completeTermEnrollments(termId: string): Promise<{ Updated: number; }> {
		const result = await this.enrollmentRepo.update(
			{ Term: { Id: termId }, Status: 'active' },
			{ Status: 'completed' },
		);
		return { Updated: result.affected ?? 0 };
	}
}
