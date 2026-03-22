import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { BASE_DTO_KEYS, BaseDto } from "./0.BaseDto";

export class GradeLevelDto extends BaseDto {
	@Expose()
	@IsString()
	SchoolId: string;

	@Expose()
	@IsString()
	Name: string; // e.g. "Grade 4"

	@Expose()
	@IsString()
	CbcLevel: string; // pre-primary | lower-primary | upper-primary | junior-secondary

	@Expose()
	@IsNumber()
	SortOrder: number;
}

export class CreateGradeLevelDto extends OmitType(
	GradeLevelDto,
	BASE_DTO_KEYS,
) {}
export class UpdateGradeLevelDto extends PartialType(CreateGradeLevelDto) {}
