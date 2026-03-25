import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsDateString, IsOptional, IsString } from "class-validator";
import { BASE_DTO_KEYS, BaseDto } from "./base.dto";

export class StudentDto extends BaseDto {
	@IsString()
	@Expose()
	schoolId: string;
	@IsString()
	@Expose()
	admissionNumber: string;
	@IsString()
	@Expose()
	firstName: string;
	@IsString()
	@Expose()
	middleName: string;
	@IsString()
	@Expose()
	lastName: string;
	@IsDateString()
	@IsOptional()
	@Expose()
	@Transform(({ value }: { value: Date }) => value?.toISOString())
	dateOfBirth?: Date;
	@IsString()
	@IsOptional()
	@Expose()
	gender?: string; // male | female
	@IsString()
	@IsOptional()
	@Expose()
	nemisId?: string;
	@IsDateString()
	@Expose()
	@Transform(({ value }: { value: Date }) => value?.toISOString())
	admissionDate: Date;

	@IsString()
	@Expose()
	status: string;
}

export class CreateStudentDto extends OmitType(StudentDto, BASE_DTO_KEYS) {}

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
