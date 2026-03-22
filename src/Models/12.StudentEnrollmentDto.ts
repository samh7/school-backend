import { IntersectionType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";
import { BaseCreateDto, BaseDto } from "./0.BaseDto";

export class EnrollmentDto extends BaseDto {
	@IsString()
	@Expose()
	StudentId: string;
	@IsString()
	@Expose()
	StreamId: string;
	@IsString()
	@Expose()
	AcademicYearId: string;
	@IsString()
	@Expose()
	TermId: string;
	@IsDate()
	@Expose()
	EnrollmentDate: Date;

	@Expose()
	@IsString()
	Status: string;
}

export class CreateEnrollmentDto extends IntersectionType(
	EnrollmentDto,
	BaseCreateDto,
) {}
export class UpdateEnrollmentDto {
	@IsString()
	@IsOptional()
	@Expose()
	Status?: string; // active | completed | transferred_out | transferred_in
}

export class BulkRolloverDto {
	// Copies all completed enrollments from FromTermId into ToTermId
	// Stream assignments remain the same — promotion is handled separately
	@IsString()
	@Expose()
	FromTermId: string;
	@IsString()
	@Expose()
	ToTermId: string;
	@IsString()
	@Expose()
	AcademicYearId: string;
}
