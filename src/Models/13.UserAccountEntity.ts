import { Exclude } from "class-transformer";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { Staff } from "./7.StaffEntity";
import { RoleEnum } from "./Types/RoleEnum";

@Entity("user_accounts")
export class UserAccount extends MyBaseEntity {
	@Column({ nullable: true })
	StaffId: string;

	@Column()
	Email: string;

	@Exclude()
	@Column()
	PasswordHash: string;

	@Column({ type: "text", enum: RoleEnum })
	Role: RoleEnum;

	@Column({ default: true })
	IsActive: boolean;

	@Column({ nullable: true })
	LastLogin: Date;

	@OneToOne(() => Staff, (s) => s.UserAccount)
	@JoinColumn({ name: "StaffId" })
	Staff: Staff;
}
