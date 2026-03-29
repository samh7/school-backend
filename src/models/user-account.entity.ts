import { Exclude } from "class-transformer";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { MyBaseEntity } from "./base.entity";
import { Staff } from "./staff.entity";
import { RoleEnum } from "./types/role-enum";

@Entity("user_accounts")
export class UserAccount extends MyBaseEntity {
	@Column({ nullable: true })
	staffId: string;

	@Column({ unique: true })
	email: string;

	@Exclude()
	@Column()
	passwordHash: string;

	@Column({ type: "text", enum: RoleEnum, default: RoleEnum.SCHOOL_ADMIN })
	role: RoleEnum;

	@Column({ default: true })
	isActive: boolean;

	@Column({ nullable: true })
	lastLogin: Date;

	@OneToOne(() => Staff, (s) => s.userAccount, { onDelete: "CASCADE" })
	@JoinColumn({ name: "staffId" })
	staff: Staff;
}
