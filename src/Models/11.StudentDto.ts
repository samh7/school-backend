import { IntersectionType, PartialType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";
import { BaseCreateDto, BaseDto } from "./0.BaseDto";

export class StudentDto extends BaseDto {
	@IsString()
	@Expose()
	SchoolId: string;
	@IsString()
	@Expose()
	AdmissionNumber: string;
	@IsString()
	@Expose()
	FirstName: string;
	@IsString()
	@Expose()
	MiddleName: string;
	@IsString()
	@Expose()
	LastName: string;
	@IsDate()
	@IsOptional()
	@Expose()
	DateOfBirth?: Date;
	@IsString()
	@IsOptional()
	@Expose()
	Gender?: string; // male | female
	@IsString()
	@IsOptional()
	@Expose()
	NemisId?: string;
	@IsDate()
	@Expose()
	AdmissionDate: Date;

	@IsString()
	@Expose()
	Status: string;
}

export class CreateStudentDto extends IntersectionType(
	StudentDto,
	BaseCreateDto,
) {}

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
