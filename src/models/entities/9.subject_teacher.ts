import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { MyBaseEntity } from "./0.base_entity";
import { AcademicYear } from "./2.academic_year";
import { Stream } from "./5.stream";
import { Staff } from "./7.staff";
import { GradeSubject } from "./8.grade_subject";

@Entity("subject_teachers")
export class SubjectTeacher extends MyBaseEntity {

	@Column()
	StaffId: string;

	@Column()
	GradeSubjectId: string;

	@Column()
	StreamId: string;
	@Column()

	AcademicYearId: string;


	// Relations
	@ManyToOne(() => Staff, (s) => s.SubjectTeacherAssignments)
	@JoinColumn({ name: 'StaffId' })
	Staff: Staff;

	@ManyToOne(() => GradeSubject, (gs) => gs.SubjectTeachers)
	@JoinColumn({ name: 'GradeSubjectId' })
	GradeSubject: GradeSubject;

	@ManyToOne(() => Stream, (s) => s.SubjectTeachers)
	@JoinColumn({ name: 'StreamId' })
	Stream: Stream;

	@ManyToOne(() => AcademicYear)
	@JoinColumn({ name: 'AcademicYearId' })
	AcademicYear: AcademicYear;
}
