import { Expose } from "class-transformer";
import { IsEmpty } from "class-validator";

export class BaseDto {
	@Expose()
	@IsEmpty()
	Id: string;

	@Expose()
	@IsEmpty()
	CreatedAt: Date;

	@Expose()
	@IsEmpty()
	UpdatedAt: Date | null;

	@Expose()
	@IsEmpty()
	DeletedAt: Date | null;
}

export const BASE_DTO_KEYS = [
	"Id",
	"CreatedAt",
	"UpdatedAt",
	"DeletedAt",
] as const;
