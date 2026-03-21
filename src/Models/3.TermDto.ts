import { Expose } from "class-transformer";
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTermDto {
	@IsString()
	@Expose()
	AcademicYearId: string;

	@IsString()
	@Expose()
	TermNumber: number;   // 1 | 2 | 3

	@IsString()
	@Expose()
	StartDate: Date;

	@IsString()
	@Expose()
	EndDate: Date;

	@IsOptional()
	@IsString()
	@Expose()
	IsCurrent?: boolean;
}

export class UpdateTermDto {

	@IsOptional()
	@IsNumber()
	@Expose()
	TermNumber?: number;

	@IsOptional()
	@IsDate()
	@Expose()
	StartDate?: Date;

	@IsOptional()
	@IsDate()
	@Expose()
	EndDate?: Date;

	@IsOptional()
	@IsBoolean()
	@Expose()
	IsCurrent?: boolean;
}
