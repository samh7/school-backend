import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
} from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { School } from "./1.SchoolEntity";
import { ClassTeacher } from "./10.ClassTeacherEntity";
import { UserAccount } from "./13.UserAccountEntity";
import { SubjectTeacher } from "./9.SubjectTeacherEntity";

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
