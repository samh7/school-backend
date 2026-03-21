import { Expose } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateGradeSubjectDto {
	@IsString()

	@Expose()
	GradeLevelId: string;
	@IsString()

	@Expose()
	SubjectId: string;
	@IsBoolean()

	@Expose()
	IsExaminable: boolean;
	@IsNumber()

	@Expose()
	PeriodsPerWeek: number;
}

export class UpdateGradeSubjectDto {
	@IsString()
	@IsOptional()

	@Expose()
	IsExaminable?: boolean;
	@IsNumber()
	@IsOptional()

	@Expose()
	PeriodsPerWeek?: number;
}
