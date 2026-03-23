import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { MyBaseEntity } from "./base.entity";
import { Student } from "./student.entity";
import { StudentEnrollment } from "./student-enrollment.entity";
import { GradeSubject } from "./grade-subject.entity";

@Entity("student-subject-assignments")
export class StudentSubjectAssignment extends MyBaseEntity {
	@Column({ name: "isOptional", default: false })
	isOptional: boolean;

	// Relations

	@ManyToOne(() => StudentEnrollment, (e) => e.subjectAssignments, {
		onDelete: "RESTRICT",
	})
	@JoinColumn({ name: "enrollmentId" })
	enrollment: StudentEnrollment;

	@ManyToOne(() => Student, (s) => s.subjectAssignments, {
		onDelete: "RESTRICT",
	})
	@JoinColumn({ name: "studentId" })
	student: Student;

	@ManyToOne(() => GradeSubject, (gs) => gs.studentAssignments, {
		onDelete: "RESTRICT",
	})
	@JoinColumn({ name: "gradeSubjectId" })
	gradeSubject: GradeSubject;
}
