import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./base.entity";
import { School } from "./school.entity";
import { StudentEnrollment } from "./student-enrollment.entity";
import { Term } from "./term.entity";

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
