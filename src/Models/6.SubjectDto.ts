import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";
import { BASE_DTO_KEYS, BaseDto } from "./0.BaseDto";

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
	LevelType: string; // pre-primary | lower-primary | upper-primary | junior-secondary
}

export class CreateSubjectDto extends OmitType(SubjectDto, BASE_DTO_KEYS) {}
export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {}
