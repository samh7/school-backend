import {
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

export abstract class MyBaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updateAt: Date | null;

	@DeleteDateColumn()
	deletedAt: Date | null;
}
