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

	@Column({ type: "text", enum: SchoolTypeEnum, default: SchoolTypeEnum.JUNIOR })
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
