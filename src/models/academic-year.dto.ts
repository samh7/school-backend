import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDate, IsString } from "class-validator";
import { BASE_DTO_KEYS, BaseDto } from "./base.dto";

export class AcademicYearDto extends BaseDto {
	@IsString()
	@Expose()
	schoolId: string;

	@IsString()
	@Expose()
	label: string;

	@IsDate()
	@Expose()
	@Type(() => Date)
	startDate: Date;

	@IsDate()
	@Expose()
	@Type(() => Date)
	endDate: Date;

	@IsBoolean()
	@Expose()
	isCurrent?: boolean;
}

export class CreateAcademicYearDto extends OmitType(
	AcademicYearDto,
	BASE_DTO_KEYS,
) {}

export class UpdateAcademicYearDto extends PartialType(CreateAcademicYearDto) {}
