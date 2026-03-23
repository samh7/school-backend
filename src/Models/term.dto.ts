import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { BASE_DTO_KEYS, BaseDto } from "./base.dto";

export class TermDto extends BaseDto {
	@IsString()
	@Expose()
	academicYearId: string;

	@IsNumber()
	@Expose()
	termNumber: number; // 1 | 2 | 3

	@IsString()
	@Expose()
	startDate: Date;

	@IsString()
	@Expose()
	endDate: Date;

	@IsOptional()
	@IsBoolean()
	@Expose()
	isCurrent?: boolean;
}

export class CreateTermDto extends OmitType(TermDto, BASE_DTO_KEYS) {}

export class UpdateTermDto extends PartialType(CreateTermDto) {}
