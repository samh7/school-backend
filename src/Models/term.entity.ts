import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./base.entity";
import { StudentEnrollment } from "./student-enrollment.entity";
import { AcademicYear } from "./academic-year.entity";

@Entity("terms")
export class Term extends MyBaseEntity {
	@Column()
	academicYearId: string;

	@Column()
	termNumber: number;

	@Column()
	startDate: Date;

	@Column({ nullable: true })
	endDate: Date;

	@Column({ default: true })
	isCurrent: boolean;

	// Relations
	@ManyToOne(() => AcademicYear, (ay) => ay.terms, { onDelete: "CASCADE" })
	@JoinColumn({ name: "academicYearId" })
	academicYear: AcademicYear;

	@OneToMany(() => StudentEnrollment, (e) => e.term)
	enrollments: StudentEnrollment[];
}
