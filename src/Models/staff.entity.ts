import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
} from "typeorm";
import { MyBaseEntity } from "./base.entity";
import { School } from "./school.entity";
import { ClassTeacher } from "./class-teacher.entity";
import { UserAccount } from "./user-account.entity";
import { SubjectTeacher } from "./subject-teacher.entity";

@Entity("staff")
export class Staff extends MyBaseEntity {
	@Column()
	schoolId: string;

	@Column()
	tscNumber: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column()
	email: string;

	@Column()
	joinDate: Date;

	@Column()
	status: string;

	@Column()
	role: string;

	// Relations
	@ManyToOne(() => School, (s) => s.staff, { onDelete: "CASCADE" })
	@JoinColumn({ name: "schoolId" })
	school: School;

	@OneToMany(() => ClassTeacher, (ct) => ct.staff)
	classTeacherAssignments: ClassTeacher[];

	@OneToMany(() => SubjectTeacher, (st) => st.staff)
	subjectTeacherAssignments: SubjectTeacher[];

	@OneToOne(() => UserAccount, (u) => u.staff)
	userAccount: UserAccount;
}
