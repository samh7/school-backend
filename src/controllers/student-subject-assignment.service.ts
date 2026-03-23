import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "../models/student.entity";
import { StudentEnrollment } from "../models/student-enrollment.entity";
import {
	AssignSubjectDto,
	BulkAssignSubjectsDto,
} from "../models/student-subject-assignment.dto";
import { StudentSubjectAssignment } from "../models/student-subject-assignment.entity";
import { GradeSubject } from "../models/grade-subject.entity";

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
			where: { enrollment: { id: enrollmentId } },
			relations: ["gradeSubject", "gradeSubject.subject", "gradeSubject.subjectTeachers", "gradeSubject.subjectTeachers.staff"],
		});
	}

	// ── Find all subject assignments across all terms for a student ─────────────

	async findByStudent(studentId: string): Promise<StudentSubjectAssignment[]> {
		return this.assignmentRepo.find({
			where: { student: { id: studentId } },
			relations: ["enrollment", "enrollment.term", "enrollment.academicYear", "gradeSubject", "gradeSubject.subject"],
		});
	}

	// ── Assign a single subject to a student enrollment ─────────────────────────

	async assign(dto: AssignSubjectDto): Promise<StudentSubjectAssignment> {
		const enrollment = await this.enrollmentRepo.findOne({
			where: { id: dto.enrollmentId },
			relations: ["stream", "stream.gradeLevel"],
		});
		if (!enrollment)
			throw new NotFoundException(`Enrollment ${dto.enrollmentId} not found`);

		const student = await this.studentRepo.findOne({
			where: { id: dto.studentId },
		});
		if (!student)
			throw new NotFoundException(`Student ${dto.studentId} not found`);

		const gradeSubject = await this.gradeSubjectRepo.findOne({
			where: { id: dto.gradeSubjectId },
			relations: ["gradeLevel", "subject"],
		});
		if (!gradeSubject)
			throw new NotFoundException(
				`Grade subject ${dto.gradeSubjectId} not found`,
			);

		// Ensure the grade subject belongs to the same grade level as the enrollment stream
		if (gradeSubject.gradeLevel.id !== enrollment.stream.gradeLevel.id) {
			throw new ConflictException(
				`Grade subject "${gradeSubject.subject.name}" does not belong to the grade level of this enrollment`,
			);
		}

		const existing = await this.assignmentRepo.findOne({
			where: {
				enrollment: { id: dto.enrollmentId },
				gradeSubject: { id: dto.gradeSubjectId },
			},
		});
		if (existing)
			throw new ConflictException(
				`Student is already assigned this subject for this enrollment`,
			);

		const assignment = this.assignmentRepo.create({
			isOptional: dto.isOptional ?? false,
			enrollment: enrollment,
			student: student,
			gradeSubject: gradeSubject,
		});
		return this.assignmentRepo.save(assignment);
	}

	// ── Bulk assign all mandatory subjects for a grade level ────────────────────
	// Called during enrollment rollover or when a new student is enrolled

	async bulkAssign(
		dto: BulkAssignSubjectsDto,
	): Promise<{ Assigned: number; Skipped: number }> {
		const enrollment = await this.enrollmentRepo.findOne({
			where: { id: dto.enrollmentId },
			relations: ["stream", "stream.gradeLevel"],
		});
		if (!enrollment)
			throw new NotFoundException(`Enrollment ${dto.enrollmentId} not found`);

		const student = await this.studentRepo.findOne({
			where: { id: dto.studentId },
		});
		if (!student)
			throw new NotFoundException(`Student ${dto.studentId} not found`);

		// Fetch all grade subjects for this grade level
		const gradeSubjects = await this.gradeSubjectRepo.find({
			where: { gradeLevel: { id: dto.gradeLevelId } },
			relations: ["subject"],
		});

		const optionalIds = new Set(dto.optionalGradeSubjectIds ?? []);

		let assigned = 0;
		let skipped = 0;

		for (const gs of gradeSubjects) {
			const existing = await this.assignmentRepo.findOne({
				where: {
					enrollment: { id: dto.enrollmentId },
					gradeSubject: { id: gs.id },
				},
			});

			if (existing) {
				skipped++;
				continue;
			}

			const assignment = this.assignmentRepo.create({
				isOptional: optionalIds.has(gs.id),
				enrollment: enrollment,
				student: student,
				gradeSubject: gs,
			});
			await this.assignmentRepo.save(assignment);
			assigned++;
		}

		return { Assigned: assigned, Skipped: skipped };
	}

	// ── Remove a single subject assignment (optional subjects only) ─────────────

	async remove(id: string): Promise<void> {
		const assignment = await this.assignmentRepo.findOne({
			where: { id: id },
			relations: ["gradeSubject"],
		});
		if (!assignment)
			throw new NotFoundException(`Subject assignment ${id} not found`);
		if (!assignment.isOptional) {
			throw new ConflictException(
				`Cannot remove a mandatory subject assignment`,
			);
		}
		await this.assignmentRepo.remove(assignment);
	}
}
