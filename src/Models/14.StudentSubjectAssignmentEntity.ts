import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { Student } from "./11.StudentEntity";
import { StudentEnrollment } from "./12.StudentEnrollmentEntity";
import { GradeSubject } from "./8.GradeSubjectEntity";

@Entity("student-subject-assignments")
export class StudentSubjectAssignment extends MyBaseEntity {
	@Column({ name: "IsOptional", default: false })
	IsOptional: boolean;

	// Relations

	@ManyToOne(() => StudentEnrollment, (e) => e.SubjectAssignments, {
		onDelete: "RESTRICT",
	})
	@JoinColumn({ name: "EnrollmentId" })
	Enrollment: StudentEnrollment;

	@ManyToOne(() => Student, (s) => s.SubjectAssignments, {
		onDelete: "RESTRICT",
	})
	@JoinColumn({ name: "StudentId" })
	Student: Student;

	@ManyToOne(() => GradeSubject, (gs) => gs.StudentAssignments, {
		onDelete: "RESTRICT",
	})
	@JoinColumn({ name: "GradeSubjectId" })
	GradeSubject: GradeSubject;
}
