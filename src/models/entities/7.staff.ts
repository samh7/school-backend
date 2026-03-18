import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { MyBaseEntity } from "./0.base_entity";
import { School } from "./1.school";
import { ClassTeacher } from "./10.class_teacher";
import { UserAccount } from "./13.user_account";
import { SubjectTeacher } from "./9.subject_teacher";

@Entity("staff")
export class Staff extends MyBaseEntity {
	@Column()
	SchoolId: string;

	@Column()
	TscNumber: string;

	@Column()
	FirstName: string;

	@Column()
	LastName: string;

	@Column()
	Email: string;

	@Column()
	JoinDate: Date;

	@Column()
	Status: string;


	// Relations
	@ManyToOne(() => School, (s) => s.Staff)
	@JoinColumn({ name: 'SchoolId' })
	School: School;

	@OneToMany(() => ClassTeacher, (ct) => ct.Staff)
	ClassTeacherAssignments: ClassTeacher[];

	@OneToMany(() => SubjectTeacher, (st) => st.Staff)
	SubjectTeacherAssignments: SubjectTeacher[];

	@OneToOne(() => UserAccount, (u) => u.Staff)
	UserAccount: UserAccount;
}
