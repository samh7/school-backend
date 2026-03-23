import { Column, Entity, OneToMany } from "typeorm";
import { MyBaseEntity } from "./base.entity";
import { Student } from "./student.entity";
import { AcademicYear } from "./academic-year.entity";
import { GradeLevel } from "./grade-level.entity";
import { Subject } from "./subject.entity";
import { Staff } from "./staff.entity";
import { SchoolTypeEnum } from "./types/school-type";

@Entity("schools")
export class School extends MyBaseEntity {
	@Column()
	name: string;

	@Column()
	knecCode: string;

	@Column()
	motto: string;

	@Column()
	county: string;

	@Column()
	subCounty: string;

	@Column()
	address: string;

	@Column()
	phone: string;

	@Column()
	email: string;

	@Column()
	logoUrl: string;

	@Column({
		type: "text",
		enum: SchoolTypeEnum,
		default: SchoolTypeEnum.JUNIOR,
	})
	schoolType: SchoolTypeEnum;

	// Relations
	@OneToMany(() => AcademicYear, (ay) => ay.school)
	academicYears: AcademicYear[];

	@OneToMany(() => GradeLevel, (gl) => gl.school)
	gradeLevels: GradeLevel[];

	@OneToMany(() => Subject, (s) => s.school)
	subjects: Subject[];

	@OneToMany(() => Staff, (st) => st.school)
	staff: Staff[];

	@OneToMany(() => Student, (s) => s.school)
	students: Student[];
}
