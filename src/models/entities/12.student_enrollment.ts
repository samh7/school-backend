import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { MyBaseEntity } from "./0.base_entity";
import { Student } from "./11.student";
import { AcademicYear } from "./2.academic_year";
import { Term } from "./3.term";
import { Stream } from "./5.stream";

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
	status: string;

	// Relations
	@ManyToOne(() => Student, (s) => s.Enrollments)
	@JoinColumn({ name: 'StudentId' })
	Student: Student;

	@ManyToOne(() => Stream, (s) => s.Enrollments)
	@JoinColumn({ name: 'StreamId' })
	Stream: Stream;

	@ManyToOne(() => AcademicYear, (ay) => ay.Enrollments)
	@JoinColumn({ name: 'AcademicYearId' })
	AcademicYear: AcademicYear;

	@ManyToOne(() => Term, (t) => t.Enrollments)
	@JoinColumn({ name: 'TermId' })
	Term: Term;

}
