import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";
import { BASE_DTO_KEYS, BaseDto } from "./base.dto";

export class SubjectDto extends BaseDto {
	@IsString()
	@Expose()
	schoolId: string;

	@IsString()
	@Expose()
	name: string;

	@IsString()
	@Expose()
	code: string;

	@IsString()
	@Expose()
	cbcLearningArea: string;

	@IsString()
	@Expose()
	levelType: string; // pre-primary | lower-primary | upper-primary | junior-secondary

	@IsString()
	@Expose()
	learningType: string;
}

export class CreateSubjectDto extends OmitType(SubjectDto, BASE_DTO_KEYS) {}
export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {}
