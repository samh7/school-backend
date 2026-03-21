import { Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStreamDto {
	@Expose()
	@IsString()
	GradeLevelId: string;

	@Expose()
	@IsString()
	Name: string;         // e.g. "North"

	@Expose()
	@IsNumber()
	@IsOptional()
	Capacity?: number;
}

export class UpdateStreamDto {
	@Expose()
	@IsString()
	@IsOptional()
	Name?: string;

	@Expose()
	@IsString()
	@IsOptional()
	Capacity?: number;
}
