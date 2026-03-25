import { Expose, Type } from "class-transformer";
import { IsEmpty } from "class-validator";

export class BaseDto {
	@Expose()
	@IsEmpty()
	id: string;

	@Expose()
	@IsEmpty()
	@Type(() => Date)
	createdAt: Date;

	@Expose()
	@IsEmpty()
	@Type(() => Date)
	updatedAt: Date | null;

	@Expose()
	@IsEmpty()
	@Type(() => Date)
	deletedAt: Date | null;
}

export const BASE_DTO_KEYS = [
	"id",
	"createdAt",
	"updatedAt",
	"deletedAt",
] as const;
