import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { MyBaseEntity } from "./0.base_entity";
import { AcademicYear } from "./2.academic_year";
import { Stream } from "./5.stream";
import { Staff } from "./7.staff";

@Entity("class_teachers")
export class ClassTeacher extends MyBaseEntity {

	@Column()
	StaffId: string;

	@Column()
	StreamId: string;

	@Column()
	AcademicYearId: string;

	// Relations
	@ManyToOne(() => Staff, (s) => s.ClassTeacherAssignments)
	@JoinColumn({ name: 'StaffId' })
	Staff: Staff;

	@ManyToOne(() => Stream, (s) => s.ClassTeachers)
	@JoinColumn({ name: 'StreamId' })
	Stream: Stream;

	@ManyToOne(() => AcademicYear)
	@JoinColumn({ name: 'AcademicYearId' })
	AcademicYear: AcademicYear;
}
