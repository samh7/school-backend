import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";
import { BASE_DTO_KEYS, BaseDto } from "./0.BaseDto";

export class GradeSubjectDto extends BaseDto {
	@IsString()
	@Expose()
	gradeLevelId: string;
	@IsString()
	@Expose()
	subjectId: string;
	@IsBoolean()
	@Expose()
	isExaminable: boolean;
	@IsNumber()
	@Expose()
	periodsPerWeek: number;
}

export class CreateGradeSubjectDto extends OmitType(
	GradeSubjectDto,
	BASE_DTO_KEYS,
) {}
export class UpdateGradeSubjectDto extends PartialType(CreateGradeSubjectDto) {}
