import { IntersectionType, PartialType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";
import { BaseCreateDto, BaseDto } from "./0.BaseDto";

export class SubjectDto extends BaseDto {
	@IsString()
	@Expose()
	SchoolId: string;

	@IsString()
	@Expose()
	Name: string;

	@IsString()
	@Expose()
	Code: string;

	@IsString()
	@Expose()
	CbcLearningArea: string;

	@IsString()
	@Expose()
	LevelType: string;    // pre-primary | lower-primary | upper-primary | junior-secondary
}

export class CreateSubjectDto extends IntersectionType(SubjectDto, BaseCreateDto) { }
export class UpdateSubjectDto extends PartialType(CreateSubjectDto) { }
