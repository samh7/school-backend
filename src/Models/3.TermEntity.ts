import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { StudentEnrollment } from "./12.StudentEnrollmentEntity";
import { AcademicYear } from "./2.AcademicYearEntity";

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
