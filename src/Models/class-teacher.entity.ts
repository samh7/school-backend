import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { MyBaseEntity } from "./base.entity";
import { AcademicYear } from "./academic-year.entity";
import { Stream } from "./stream.entity";
import { Staff } from "./staff.entity";

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
