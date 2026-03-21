import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { MyBaseEntity } from "./0.base_entity";
import { School } from "./1.SchoolEntity";
import { ClassTeacher } from "./10.ClassTeacherEntity";
import { UserAccount } from "./13.UserAccountEntity";
import { SubjectTeacher } from "./9.SubjectTeacherEntity";

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

	@Column()
	Role: string;


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
