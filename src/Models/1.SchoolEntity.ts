import { Column, Entity, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { Student } from "./11.StudentEntity";
import { AcademicYear } from "./2.AcademicYearEntity";
import { GradeLevel } from "./4.GradeLevelEntity";
import { Subject } from "./6.SubjectEntity";
import { Staff } from "./7.StaffEntity";
import { SchoolTypeEnum } from "./Types/SchoolType";

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
