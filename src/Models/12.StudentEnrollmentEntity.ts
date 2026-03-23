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
	StudentId: string;

	@Column()
	StreamId: string;

	@Column()
	AcademicYearId: string;

	@Column()
	TermId: string;

	@Column()
	EnrollmentDate: Date;

	@Column()
	Status: string;

	// Relations
	@ManyToOne(() => Student, (s) => s.Enrollments, { onDelete: "RESTRICT" })
	@JoinColumn({ name: "StudentId" })
	Student: Student;

	@ManyToOne(() => Stream, (s) => s.Enrollments, { onDelete: "RESTRICT" })
	@JoinColumn({ name: "StreamId" })
	Stream: Stream;

	@ManyToOne(() => AcademicYear, (ay) => ay.Enrollments, {
		onDelete: "RESTRICT",
	})
	@JoinColumn({ name: "AcademicYearId" })
	AcademicYear: AcademicYear;

	@ManyToOne(() => Term, (t) => t.Enrollments, { onDelete: "RESTRICT" })
	@JoinColumn({ name: "TermId" })
	Term: Term;

	@OneToMany(() => StudentSubjectAssignment, (ssa) => ssa.Enrollment)
	SubjectAssignments: StudentSubjectAssignment[];
}
