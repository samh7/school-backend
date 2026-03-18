import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Timestamp } from "typeorm/browser";
import { MyBaseEntity } from "./0.base_entity";
import { Staff } from "./7.staff";

@Entity("user_accounts")
export class UserAccount extends MyBaseEntity {
	@Column()
	StaffId: string;

	@Column()
	Email: string;

	@Column()
	PasswordHash: string;

	@Column()
	Role: string;

	@Column({ default: true })
	IsActive: boolean;

	@Column()
	LastLogin: Timestamp;

	@OneToOne(() => Staff, (s) => s.UserAccount)
	@JoinColumn({ name: 'StaffId' })
	Staff: Staff;


}
