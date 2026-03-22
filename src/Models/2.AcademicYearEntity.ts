import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { School } from "./1.SchoolEntity";
import { StudentEnrollment } from "./12.StudentEnrollmentEntity";
import { Term } from "./3.TermEntity";

@Entity("academic_years")
export class AcademicYear extends MyBaseEntity {
	@Column()
	SchoolId: string;

	@Column()
	Label: string;

	@Column()
	StartDate: Date;

	@Column({ nullable: true })
	EndDate: Date;

	@Column({ default: true })
	IsCurrent: boolean;

	// Relations
	@ManyToOne(() => School, (s) => s.AcademicYears)
	@JoinColumn({ name: 'SchoolId' })
	School: School;

	@OneToMany(() => Term, (t) => t.AcademicYear)
	Terms: Term[];

	@OneToMany(() => StudentEnrollment, (e) => e.AcademicYear)
	Enrollments: StudentEnrollment[];
}
