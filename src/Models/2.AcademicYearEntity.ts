import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { School } from "./1.SchoolEntity";
import { StudentEnrollment } from "./12.StudentEnrollmentEntity";
import { Term } from "./3.TermEntity";

@Entity("academic_years")
export class AcademicYear extends MyBaseEntity {
	@Column()
	schoolId: string;

	@Column()
	label: string;

	@Column()
	startDate: Date;

	@Column({ nullable: true })
	endDate: Date;

	@Column({ default: true })
	isCurrent: boolean;

	// Relations
	@ManyToOne(() => School, (s) => s.academicYears, { onDelete: "CASCADE" })
	@JoinColumn({ name: "schoolId" })
	school: School;

	@OneToMany(() => Term, (t) => t.academicYear)
	terms: Term[];

	@OneToMany(() => StudentEnrollment, (e) => e.academicYear)
	enrollments: StudentEnrollment[];
}
