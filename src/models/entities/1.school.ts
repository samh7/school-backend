import { Column, Entity, OneToMany } from "typeorm";
import { SchoolTypeEnum } from "../enums/school_type";
import { MyBaseEntity } from "./0.base_entity";
import { Student } from "./11.student";
import { AcademicYear } from "./2.academic_year";
import { GradeLevel } from "./4.grade_level";
import { Subject } from "./6.subject";
import { Staff } from "./7.staff";

@Entity("schools")
export class School extends MyBaseEntity {

	@Column()
	Name: string;

	@Column()
	KnecCode: string;

	@Column()
	Motto: string;

	@Column()
	County: string;

	@Column()
	SubCounty: string;

	@Column()

	Address: string;

	@Column()
	Phone: string;

	@Column()
	Email: string;

	@Column()
	LogoUrl: string;

	@Column("enum", { enum: SchoolTypeEnum, default: SchoolTypeEnum.JUNIOR })
	SchoolType: SchoolTypeEnum;


	// Relations
	@OneToMany(() => AcademicYear, (ay) => ay.School)
	AcademicYears: AcademicYear[];

	@OneToMany(() => GradeLevel, (gl) => gl.School)
	GradeLevels: GradeLevel[];

	@OneToMany(() => Subject, (s) => s.School)
	Subjects: Subject[];

	@OneToMany(() => Staff, (st) => st.School)
	Staff: Staff[];

	@OneToMany(() => Student, (s) => s.School)
	Students: Student[];
}
