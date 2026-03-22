import { IntersectionType, PartialType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { BaseCreateDto, BaseDto } from "./0.BaseDto";

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

export class CreateTermDto extends IntersectionType(TermDto, BaseCreateDto) {}

export class UpdateTermDto extends PartialType(CreateTermDto) {}
