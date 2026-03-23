import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { AcademicYear } from "./2.AcademicYearEntity";
import { Stream } from "./5.StreamEntity";
import { Staff } from "./7.StaffEntity";
import { GradeSubject } from "./8.GradeSubjectEntity";

@Entity("subject_teachers")
export class SubjectTeacher extends MyBaseEntity {
	@Column()
	staffId: string;

	@Column()
	gradeSubjectId: string;

	@Column()
	streamId: string;
	@Column()
	academicYearId: string;

	// Relations
	@ManyToOne(() => Staff, (s) => s.subjectTeacherAssignments, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "staffId" })
	staff: Staff;

	@ManyToOne(() => GradeSubject, (gs) => gs.subjectTeachers, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "gradeSubjectId" })
	gradeSubject: GradeSubject;

	@ManyToOne(() => Stream, (s) => s.subjectTeachers, { onDelete: "CASCADE" })
	@JoinColumn({ name: "streamId" })
	stream: Stream;

	@ManyToOne(() => AcademicYear, { onDelete: "CASCADE" })
	@JoinColumn({ name: "academicYearId" })
	academicYear: AcademicYear;
}
