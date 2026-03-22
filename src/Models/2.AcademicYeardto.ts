import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsBoolean, IsDate, IsString } from "class-validator";
import { BASE_DTO_KEYS, BaseDto } from "./0.BaseDto";

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

export class CreateAcademicYearDto extends OmitType(
	AcademicYearDto,
	BASE_DTO_KEYS,
) {}

export class UpdateAcademicYearDto extends PartialType(CreateAcademicYearDto) {}
