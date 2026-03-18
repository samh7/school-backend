import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.base_entity";
import { School } from "./1.school";
import { StudentEnrollment } from "./12.student_enrollment";
import { Term } from "./3.term";

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
