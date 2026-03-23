import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { AcademicYear } from "./2.AcademicYearEntity";
import { Stream } from "./5.StreamEntity";
import { Staff } from "./7.StaffEntity";

@Entity("class_teachers")
export class ClassTeacher extends MyBaseEntity {
	@Column()
	staffId: string;

	@Column()
	streamId: string;

	@Column()
	academicYearId: string;

	// Relations
	@ManyToOne(() => Staff, (s) => s.classTeacherAssignments, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "staffId" })
	staff: Staff;

	@ManyToOne(() => Stream, (s) => s.classTeachers, { onDelete: "CASCADE" })
	@JoinColumn({ name: "streamId" })
	stream: Stream;

	@ManyToOne(() => AcademicYear, { onDelete: "CASCADE" })
	@JoinColumn({ name: "academicYearId" })
	academicYear: AcademicYear;
}
