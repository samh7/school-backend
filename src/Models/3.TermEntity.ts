import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { StudentEnrollment } from "./12.StudentEnrollmentEntity";
import { AcademicYear } from "./2.AcademicYearEntity";

@Entity("terms")
export class Term extends MyBaseEntity {

	@Column()
	AcademicYearId: string;

	@Column()
	TermNumber: number;

	@Column()
	StartDate: Date;

	@Column({ nullable: true })
	EndDate: Date;

	@Column({ default: true })
	IsCurrent: boolean;

	// Relations
	@ManyToOne(() => AcademicYear, (ay) => ay.Terms)
	@JoinColumn({ name: 'AcademicYearId' })
	AcademicYear: AcademicYear;

	@OneToMany(() => StudentEnrollment, (e) => e.Term)
	Enrollments: StudentEnrollment[];

}
