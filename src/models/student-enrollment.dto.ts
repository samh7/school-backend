import { OmitType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";
import { BASE_DTO_KEYS, BaseDto } from "./base.dto";

export class EnrollmentDto extends BaseDto {
	@IsString()
	@Expose()
	studentId: string;
	@IsString()
	@Expose()
	streamId: string;
	@IsString()
	@Expose()
	academicYearId: string;
	@IsString()
	@Expose()
	termId: string;
	@IsDate()
	@Expose()
	@Type(() => Date)
	enrollmentDate: Date;

	@Expose()
	@IsString()
	status: string;
}

export class CreateEnrollmentDto extends OmitType(
	EnrollmentDto,
	BASE_DTO_KEYS,
) {}
export class UpdateEnrollmentDto {
	@IsString()
	@IsOptional()
	@Expose()
	status?: string; // active | completed | transferred_out | transferred_in
}

export class BulkRolloverDto {
	// Copies all completed enrollments from FromTermId into ToTermId
	// Stream assignments remain the same — promotion is handled separately
	@IsString()
	@Expose()
	fromTermId: string;
	@IsString()
	@Expose()
	toTermId: string;
	@IsString()
	@Expose()
	academicYearId: string;
}
