import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { BASE_DTO_KEYS, BaseDto } from "./base.dto";

export class GradeLevelDto extends BaseDto {
	@Expose()
	@IsString()
	schoolId: string;

	@Expose()
	@IsString()
	name: string; // e.g. "Grade 4"

	@Expose()
	@IsString()
	cbcLevel: string; // pre-primary | lower-primary | upper-primary | junior-secondary

	@Expose()
	@IsNumber()
	sortOrder: number;
}

export class CreateGradeLevelDto extends OmitType(
	GradeLevelDto,
	BASE_DTO_KEYS,
) {}
export class UpdateGradeLevelDto extends PartialType(CreateGradeLevelDto) {}
