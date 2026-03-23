import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsEnum, IsString, ValidateNested } from "class-validator";
import { BASE_DTO_KEYS, BaseDto } from "./0.BaseDto";
import { CreateStaffWithoutSchoolDto } from "./7.StaffDto";
import { SchoolTypeEnum } from "./Types/SchoolType";

export class SchoolDto extends BaseDto {
	@IsString()
	@Expose()
	name: string;

	@IsString()
	@Expose()
	knecCode: string;

	@IsString()
	@Expose()
	motto: string;

	@IsString()
	@Expose()
	county: string;

	@IsString()
	@Expose()
	subCounty: string;

	@IsString()
	@Expose()
	address: string;

	@IsString()
	@Expose()
	phone: string;

	@IsString()
	@Expose()
	email: string;

	@IsString()
	@Expose()
	logoUrl: string;

	@IsEnum(SchoolTypeEnum)
	@Expose()
	schoolType: SchoolTypeEnum;
}

export class CreateSchoolDto extends OmitType(SchoolDto, BASE_DTO_KEYS) {}
export class UpdateSchoolDto extends PartialType(CreateSchoolDto) {}

export class CreateWithSchoolAdminAccountDto {
	@ValidateNested()
	@Type(() => CreateSchoolDto)
	@Expose()
	createSchoolDto!: CreateSchoolDto;

	@ValidateNested()
	@Type(() => CreateStaffWithoutSchoolDto)
	@Expose()
	createStaffDto!: CreateStaffWithoutSchoolDto;
}
