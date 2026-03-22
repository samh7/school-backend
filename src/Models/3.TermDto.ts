import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { BASE_DTO_KEYS, BaseDto } from "./0.BaseDto";

export class TermDto extends BaseDto {
	@IsString()
	@Expose()
	AcademicYearId: string;

	@IsString()
	@Expose()
	TermNumber: number; // 1 | 2 | 3

	@IsString()
	@Expose()
	StartDate: Date;

	@IsString()
	@Expose()
	EndDate: Date;

	@IsOptional()
	@IsString()
	@Expose()
	IsCurrent?: boolean;
}

export class CreateTermDto extends OmitType(TermDto, BASE_DTO_KEYS) {}

export class UpdateTermDto extends PartialType(CreateTermDto) {}
