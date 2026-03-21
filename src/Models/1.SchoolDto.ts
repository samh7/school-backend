import { Expose } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { SchoolTypeEnum } from "./Types/SchoolType";

export class CreateSchoolDto {
	@IsString()
	@Expose()
	Name: string;

	@IsString()
	@Expose()
	@IsOptional()
	KnecCode?: string;

	@IsString()
	@Expose()
	@IsOptional()
	County?: string;

	@IsString()
	@Expose()
	@IsOptional()
	SubCounty?: string;

	@IsString()
	@Expose()
	@IsOptional()
	Phone?: string;

	@IsString()
	@Expose()
	@IsOptional()
	Email?: string;

	@IsEnum(SchoolTypeEnum)
	@Expose()
	@IsOptional()
	SchoolType?: SchoolTypeEnum; // public | private | mission
}

export class UpdateSchoolDto {

	@IsString()
	@Expose()
	@IsOptional()
	Name?: string;

	@IsString()
	@Expose()
	@IsOptional()
	KnecCode?: string;

	@IsString()
	@Expose()
	@IsOptional()
	County?: string;

	@IsString()
	@Expose()
	@IsOptional()
	SubCounty?: string;

	@IsString()
	@Expose()
	@IsOptional()
	Phone?: string;

	@IsString()
	@Expose()
	@IsOptional()
	Email?: string;

	@IsString()
	@Expose()
	@IsOptional()
	SchoolType?: string;

	@IsBoolean()
	@Expose()
	@IsOptional()
	IsActive?: boolean;
}
