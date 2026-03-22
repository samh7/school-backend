import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { School } from "./1.SchoolEntity";
import { StudentEnrollment } from "./12.StudentEnrollmentEntity";

@Entity("students")
export class Student extends MyBaseEntity {
	@Column()
	SchoolId: string;

	@Column()
	AdmissionNumber: string;

	@Column()
	FirstName: string;

	@Column()
	MiddleName: string;

	@Column()
	LastName: string;

	@Column()
	DateOfBirth: Date;

	@Column()
	Gender: string;

	@Column()
	NemisId: string;

	@Column()
	PhotoUrl: string;

	@Column()
	AdmissionDate: Date;

	@Column()
	Status: string;

	// Relations
	@ManyToOne(() => School, (s) => s.Students)
	@JoinColumn({ name: "SchoolId" })
	School: School;

	@OneToMany(() => StudentEnrollment, (e) => e.Student)
	Enrollments: StudentEnrollment[];
}
