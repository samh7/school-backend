import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { School } from "./1.SchoolEntity";
import { StudentEnrollment } from "./12.StudentEnrollmentEntity";
import { StudentSubjectAssignment } from "./14.StudentSubjectAssignmentEntity";

@Entity("students")
export class Student extends MyBaseEntity {
	@Column()
	schoolId: string;

	@Column()
	admissionNumber: string;

	@Column()
	firstName: string;

	@Column()
	middleName: string;

	@Column()
	lastName: string;

	@Column()
	dateOfBirth: Date;

	@Column()
	gender: string;

	@Column()
	nemisId: string;

	@Column({ nullable: true })
	photoUrl: string;

	@Column()
	admissionDate: Date;

	@Column()
	status: string;

	// Relations
	@ManyToOne(() => School, (s) => s.students, { onDelete: "RESTRICT" })
	@JoinColumn({ name: "schoolId" })
	school: School;

	@OneToMany(() => StudentEnrollment, (e) => e.student)
	enrollments: StudentEnrollment[];

	@OneToMany(() => StudentSubjectAssignment, (ssa) => ssa.student)
	subjectAssignments: StudentSubjectAssignment[];
}
