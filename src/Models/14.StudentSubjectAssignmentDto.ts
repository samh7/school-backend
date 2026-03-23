import { Expose } from "class-transformer";
import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class AssignSubjectDto {
	@Expose()
	@IsString()
	enrollmentId: string;

	@Expose()
	@IsString()
	studentId: string;

	@Expose()
	@IsString()
	gradeSubjectId: string;

	@Expose()
	@IsBoolean()
	@IsOptional()
	isOptional?: boolean;
}

export class BulkAssignSubjectsDto {
	// Assigns all mandatory GradeSubjects for a grade level to a student enrollment
	// Pass optional subject IDs separately

	@Expose()
	@IsString()
	enrollmentId: string;

	@Expose()
	@IsString()
	studentId: string;

	@Expose()
	@IsString()
	gradeLevelId: string;

	@Expose()
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	optionalGradeSubjectIds?: string[];
}
