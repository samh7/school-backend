import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./base.entity";
import { School } from "./school.entity";
import { StudentEnrollment } from "./student-enrollment.entity";
import { StudentSubjectAssignment } from "./student-subject-assignment.entity";

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
