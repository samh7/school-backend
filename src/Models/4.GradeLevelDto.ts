import { Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateGradeLevelDto {
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

export class UpdateGradeLevelDto {

	@Expose()
	@IsString()
	Name?: string;

	@Expose()
	@IsString()
	CbcLevel?: string;

	@Expose()
	@IsNumber()
	SortOrder?: number;
}
