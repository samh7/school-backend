import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsString } from "class-validator";
import { BASE_DTO_KEYS, BaseDto } from "./0.BaseDto";
import { SchoolTypeEnum } from "./Types/SchoolType";

export class SchoolDto extends BaseDto {
	@IsString()
	@Expose()
	Name: string;

	@IsString()
	@Expose()
	KnecCode: string;

	@IsString()
	@Expose()
	Motto: string;

	@IsString()
	@Expose()
	County: string;

	@IsString()
	@Expose()
	SubCounty: string;

	@IsString()
	@Expose()
	Address: string;

	@IsString()
	@Expose()
	Phone: string;

	@IsString()
	@Expose()
	Email: string;

	@IsString()
	@Expose()
	LogoUrl: string;

	@IsEnum(SchoolTypeEnum)
	@Expose()
	SchoolType: SchoolTypeEnum;
}

export class CreateSchoolDto extends OmitType(SchoolDto, BASE_DTO_KEYS) {}
export class UpdateSchoolDto extends PartialType(CreateSchoolDto) {}
