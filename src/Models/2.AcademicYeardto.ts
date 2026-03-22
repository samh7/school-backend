import { IntersectionType, PartialType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import { IsBoolean, IsDate, IsString } from "class-validator";
import { BaseCreateDto, BaseDto } from "./0.BaseDto";

export class AcademicYearDto extends BaseDto {

	@IsString()
	@Expose()
	SchoolId: string;

	@IsString()
	@Expose()
	Label: string;

	@IsDate()
	@Expose()
	StartDate: Date;

	@IsDate()
	@Expose()
	EndDate: Date;

	@IsBoolean()
	@Expose()
	IsCurrent?: boolean;
}

export class CreateAcademicYearDto extends IntersectionType(AcademicYearDto, BaseCreateDto) { }

export class UpdateAcademicYearDto extends PartialType(CreateAcademicYearDto) { }
