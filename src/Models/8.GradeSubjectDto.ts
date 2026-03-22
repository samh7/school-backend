import { IntersectionType, PartialType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";
import { BaseCreateDto, BaseDto } from "./0.BaseDto";

export class GradeSubjectDto extends BaseDto {
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

export class CreateGradeSubjectDto extends IntersectionType(GradeSubjectDto, BaseCreateDto) { }
export class UpdateGradeSubjectDto extends PartialType(CreateGradeSubjectDto) { }
