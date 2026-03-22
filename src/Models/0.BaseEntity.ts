import {
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

export abstract class MyBaseEntity {
	@PrimaryGeneratedColumn()
	Id: string;

	@CreateDateColumn()
	CreatedAt: Date;

	@UpdateDateColumn()
	UpdateAt: Date | null;

	@DeleteDateColumn()
	DeletedAt: Date | null;
}
