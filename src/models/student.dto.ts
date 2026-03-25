import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";
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
	@IsDate()
	@IsOptional()
	@Expose()
	@Type(() => Date)
	dateOfBirth?: Date;
	@IsString()
	@IsOptional()
	@Expose()
	gender?: string; // male | female
	@IsString()
	@IsOptional()
	@Expose()
	nemisId?: string;
	@IsDate()
	@Expose()
	@Type(() => Date)
	admissionDate: Date;

	@IsString()
	@Expose()
	status: string;
}

export class CreateStudentDto extends OmitType(StudentDto, BASE_DTO_KEYS) {}

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
