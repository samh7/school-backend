import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { Student } from "./11.StudentEntity";
import { StudentSubjectAssignment } from "./14.StudentSubjectAssignmentEntity";
import { AcademicYear } from "./2.AcademicYearEntity";
import { Term } from "./3.TermEntity";
import { Stream } from "./5.StreamEntity";

@Entity("student_enrollmments")
export class StudentEnrollment extends MyBaseEntity {
	@Column()
	studentId: string;

	@Column()
	streamId: string;

	@Column()
	academicYearId: string;

	@Column()
	termId: string;

	@Column()
	enrollmentDate: Date;

	@Column()
	status: string;

	// Relations
	@ManyToOne(() => Student, (s) => s.enrollments, { onDelete: "RESTRICT" })
	@JoinColumn({ name: "studentId" })
	student: Student;

	@ManyToOne(() => Stream, (s) => s.enrollments, { onDelete: "RESTRICT" })
	@JoinColumn({ name: "streamId" })
	stream: Stream;

	@ManyToOne(() => AcademicYear, (ay) => ay.enrollments, {
		onDelete: "RESTRICT",
	})
	@JoinColumn({ name: "academicYearId" })
	academicYear: AcademicYear;

	@ManyToOne(() => Term, (t) => t.enrollments, { onDelete: "RESTRICT" })
	@JoinColumn({ name: "termId" })
	term: Term;

	@OneToMany(() => StudentSubjectAssignment, (ssa) => ssa.enrollment)
	subjectAssignments: StudentSubjectAssignment[];
}
