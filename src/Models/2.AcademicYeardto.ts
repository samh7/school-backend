import { Expose } from "class-transformer";
import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";

export class CreateAcademicYearDto {

	@IsString()
	@Expose()
	SchoolId: string;

	@IsString()
	@Expose()
	Label: string;

	@IsDate()
	@Expose()
	StartDate: Date;

	@IsDate()
	@Expose()
	EndDate: Date;

	@IsBoolean()
	@Expose()
	IsCurrent?: boolean;
}

export class UpdateAcademicYearDto {
	@IsString()
	@IsOptional()
	@Expose()
	Label?: string;

	@IsDate()
	@IsOptional()
	@Expose()
	StartDate?: Date;

	@IsDate()
	@IsOptional()
	@Expose()
	EndDate?: Date;

	@IsOptional()
	@IsBoolean()
	@Expose()
	IsCurrent?: boolean;
}
