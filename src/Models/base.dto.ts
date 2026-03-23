import { Expose } from "class-transformer";
import { IsEmpty } from "class-validator";

export class BaseDto {
	@Expose()
	@IsEmpty()
	id: string;

	@Expose()
	@IsEmpty()
	createdAt: Date;

	@Expose()
	@IsEmpty()
	updatedAt: Date | null;

	@Expose()
	@IsEmpty()
	deletedAt: Date | null;
}

export const BASE_DTO_KEYS = [
	"id",
	"createdAt",
	"updatedAt",
	"deletedAt",
] as const;
