import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { MyBaseEntity } from "./base.entity";
import { AcademicYear } from "./academic-year.entity";
import { Stream } from "./stream.entity";
import { Staff } from "./staff.entity";
import { GradeSubject } from "./grade-subject.entity";

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
