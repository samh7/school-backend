import { IntersectionType, PartialType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { BaseCreateDto, BaseDto } from "./0.BaseDto";

export class GradeLevelDto extends BaseDto {
	@Expose()
	@IsString()
	SchoolId: string;

	@Expose()
	@IsString()
	Name: string;         // e.g. "Grade 4"

	@Expose()
	@IsString()
	CbcLevel: string;     // pre-primary | lower-primary | upper-primary | junior-secondary

	@Expose()
	@IsNumber()
	SortOrder: number;
}

export class CreateGradeLevelDto extends IntersectionType(GradeLevelDto, BaseCreateDto) { }
export class UpdateGradeLevelDto extends PartialType(CreateGradeLevelDto) { }
