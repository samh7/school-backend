import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class CreateSubjectDto {
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

export class UpdateSubjectDto {
	@IsString()
	@IsOptional()
	@Expose()
	Name?: string;

	@IsString()
	@IsOptional()
	@Expose()
	Code?: string;

	@IsString()
	@IsOptional()
	@Expose()
	CbcLearningArea?: string;

	@IsString()
	@IsOptional()
	@Expose()
	LevelType?: string;
}
