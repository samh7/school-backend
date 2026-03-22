import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { AcademicYear } from "./2.AcademicYearEntity";
import { Stream } from "./5.StreamEntity";
import { Staff } from "./7.StaffEntity";
import { GradeSubject } from "./8.GradeSubjectEntity";

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
	@ManyToOne(() => Staff, (s) => s.SubjectTeacherAssignments, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "StaffId" })
	Staff: Staff;

	@ManyToOne(() => GradeSubject, (gs) => gs.SubjectTeachers, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "GradeSubjectId" })
	GradeSubject: GradeSubject;

	@ManyToOne(() => Stream, (s) => s.SubjectTeachers, { onDelete: "CASCADE" })
	@JoinColumn({ name: "StreamId" })
	Stream: Stream;

	@ManyToOne(() => AcademicYear, { onDelete: "CASCADE" })
	@JoinColumn({ name: "AcademicYearId" })
	AcademicYear: AcademicYear;
}
