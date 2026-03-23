import { Exclude } from "class-transformer";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { Staff } from "./7.StaffEntity";
import { RoleEnum } from "./Types/RoleEnum";

@Entity("user_accounts")
export class UserAccount extends MyBaseEntity {
	@Column({ nullable: true })
	staffId: string;

	@Column()
	email: string;

	@Exclude()
	@Column()
	passwordHash: string;

	@Column({ type: "text", enum: RoleEnum })
	role: RoleEnum;

	@Column({ default: true })
	isActive: boolean;

	@Column({ nullable: true })
	lastLogin: Date;

	@OneToOne(() => Staff, (s) => s.userAccount, { onDelete: "CASCADE" })
	@JoinColumn({ name: "staffId" })
	staff: Staff;
}
