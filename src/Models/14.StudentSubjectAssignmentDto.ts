import { Expose } from "class-transformer";
import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class AssignSubjectDto {
	@Expose()
	@IsString()
	EnrollmentId: string;

	@Expose()
	@IsString()
	StudentId: string;

	@Expose()
	@IsString()
	GradeSubjectId: string;

	@Expose()
	@IsBoolean()
	@IsOptional()
	IsOptional?: boolean;
}

export class BulkAssignSubjectsDto {
	// Assigns all mandatory GradeSubjects for a grade level to a student enrollment
	// Pass optional subject IDs separately

	@Expose()
	@IsString()
	EnrollmentId: string;

	@Expose()
	@IsString()
	StudentId: string;

	@Expose()
	@IsString()
	GradeLevelId: string;

	@Expose()
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	OptionalGradeSubjectIds?: string[];
}
