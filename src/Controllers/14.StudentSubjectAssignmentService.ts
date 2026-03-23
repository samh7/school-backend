import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "../Models/11.StudentEntity";
import { StudentEnrollment } from "../Models/12.StudentEnrollmentEntity";
import {
	AssignSubjectDto,
	BulkAssignSubjectsDto,
} from "../Models/14.StudentSubjectAssignmentDto";
import { StudentSubjectAssignment } from "../Models/14.StudentSubjectAssignmentEntity";
import { GradeSubject } from "../Models/8.GradeSubjectEntity";

@Injectable()
export class StudentSubjectAssignmentService {
	constructor(
		@InjectRepository(StudentSubjectAssignment)
		private readonly assignmentRepo: Repository<StudentSubjectAssignment>,
		@InjectRepository(StudentEnrollment)
		private readonly enrollmentRepo: Repository<StudentEnrollment>,
		@InjectRepository(Student)
		private readonly studentRepo: Repository<Student>,
		@InjectRepository(GradeSubject)
		private readonly gradeSubjectRepo: Repository<GradeSubject>,
	) {}

	// ── Find all subjects for a student in a specific enrollment (term) ─────────

	async findByEnrollment(
		enrollmentId: string,
	): Promise<StudentSubjectAssignment[]> {
		return this.assignmentRepo.find({
			where: { Enrollment: { Id: enrollmentId } },
			relations: [
				"GradeSubject",
				"GradeSubject.Subject",
				"GradeSubject.SubjectTeachers",
				"GradeSubject.SubjectTeachers.Staff",
			],
		});
	}

	// ── Find all subject assignments across all terms for a student ─────────────

	async findByStudent(studentId: string): Promise<StudentSubjectAssignment[]> {
		return this.assignmentRepo.find({
			where: { Student: { Id: studentId } },
			relations: [
				"Enrollment",
				"Enrollment.Term",
				"Enrollment.AcademicYear",
				"GradeSubject",
				"GradeSubject.Subject",
			],
		});
	}

	// ── Assign a single subject to a student enrollment ─────────────────────────

	async assign(dto: AssignSubjectDto): Promise<StudentSubjectAssignment> {
		const enrollment = await this.enrollmentRepo.findOne({
			where: { Id: dto.EnrollmentId },
			relations: ["Stream", "Stream.GradeLevel"],
		});
		if (!enrollment)
			throw new NotFoundException(`Enrollment ${dto.EnrollmentId} not found`);

		const student = await this.studentRepo.findOne({
			where: { Id: dto.StudentId },
		});
		if (!student)
			throw new NotFoundException(`Student ${dto.StudentId} not found`);

		const gradeSubject = await this.gradeSubjectRepo.findOne({
			where: { Id: dto.GradeSubjectId },
			relations: ["GradeLevel", "Subject"],
		});
		if (!gradeSubject)
			throw new NotFoundException(
				`Grade subject ${dto.GradeSubjectId} not found`,
			);

		// Ensure the grade subject belongs to the same grade level as the enrollment stream
		if (gradeSubject.GradeLevel.Id !== enrollment.Stream.GradeLevel.Id) {
			throw new ConflictException(
				`Grade subject "${gradeSubject.Subject.Name}" does not belong to the grade level of this enrollment`,
			);
		}

		const existing = await this.assignmentRepo.findOne({
			where: {
				Enrollment: { Id: dto.EnrollmentId },
				GradeSubject: { Id: dto.GradeSubjectId },
			},
		});
		if (existing)
			throw new ConflictException(
				`Student is already assigned this subject for this enrollment`,
			);

		const assignment = this.assignmentRepo.create({
			IsOptional: dto.IsOptional ?? false,
			Enrollment: enrollment,
			Student: student,
			GradeSubject: gradeSubject,
		});
		return this.assignmentRepo.save(assignment);
	}

	// ── Bulk assign all mandatory subjects for a grade level ────────────────────
	// Called during enrollment rollover or when a new student is enrolled

	async bulkAssign(
		dto: BulkAssignSubjectsDto,
	): Promise<{ Assigned: number; Skipped: number }> {
		const enrollment = await this.enrollmentRepo.findOne({
			where: { Id: dto.EnrollmentId },
			relations: ["Stream", "Stream.GradeLevel"],
		});
		if (!enrollment)
			throw new NotFoundException(`Enrollment ${dto.EnrollmentId} not found`);

		const student = await this.studentRepo.findOne({
			where: { Id: dto.StudentId },
		});
		if (!student)
			throw new NotFoundException(`Student ${dto.StudentId} not found`);

		// Fetch all grade subjects for this grade level
		const gradeSubjects = await this.gradeSubjectRepo.find({
			where: { GradeLevel: { Id: dto.GradeLevelId } },
			relations: ["Subject"],
		});

		const optionalIds = new Set(dto.OptionalGradeSubjectIds ?? []);

		let assigned = 0;
		let skipped = 0;

		for (const gs of gradeSubjects) {
			const existing = await this.assignmentRepo.findOne({
				where: {
					Enrollment: { Id: dto.EnrollmentId },
					GradeSubject: { Id: gs.Id },
				},
			});

			if (existing) {
				skipped++;
				continue;
			}

			const assignment = this.assignmentRepo.create({
				IsOptional: optionalIds.has(gs.Id),
				Enrollment: enrollment,
				Student: student,
				GradeSubject: gs,
			});
			await this.assignmentRepo.save(assignment);
			assigned++;
		}

		return { Assigned: assigned, Skipped: skipped };
	}

	// ── Remove a single subject assignment (optional subjects only) ─────────────

	async remove(id: string): Promise<void> {
		const assignment = await this.assignmentRepo.findOne({
			where: { Id: id },
			relations: ["GradeSubject"],
		});
		if (!assignment)
			throw new NotFoundException(`Subject assignment ${id} not found`);
		if (!assignment.IsOptional) {
			throw new ConflictException(
				`Cannot remove a mandatory subject assignment`,
			);
		}
		await this.assignmentRepo.remove(assignment);
	}
}
