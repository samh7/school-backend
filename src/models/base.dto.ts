import { Expose, Transform } from "class-transformer";
import { IsEmpty } from "class-validator";

export class BaseDto {
	@Expose()
	@IsEmpty()
	id: string;

	@Expose()
	@IsEmpty()
	@Transform(({ value }: { value: Date }) => value?.toISOString())
	createdAt: Date;

	@Expose()
	@IsEmpty()
	@Transform(({ value }: { value: Date }) => value?.toISOString())
	updatedAt: Date | null;

	@Expose()
	@IsEmpty()
	@Transform(({ value }: { value: Date }) => value?.toISOString())
	deletedAt: Date | null;
}

export const BASE_DTO_KEYS = [
	"id",
	"createdAt",
	"updatedAt",
	"deletedAt",
] as const;
