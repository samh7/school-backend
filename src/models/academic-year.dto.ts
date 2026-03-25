import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsBoolean, IsDateString, IsString } from "class-validator";
import { BASE_DTO_KEYS, BaseDto } from "./base.dto";

export class AcademicYearDto extends BaseDto {
	@IsString()
	@Expose()
	schoolId: string;

	@IsString()
	@Expose()
	label: string;

	@IsDateString()
	@Expose()
	@Transform(({ value }: { value: Date }) => value?.toISOString())
	startDate: Date;

	@IsDateString()
	@Expose()
	@Transform(({ value }: { value: Date }) => value?.toISOString())
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
