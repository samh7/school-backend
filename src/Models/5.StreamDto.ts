import { IntersectionType, PartialType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { BaseCreateDto, BaseDto } from "./0.BaseDto";

export class StreamDto extends BaseDto {
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

export class CreateStreamDto extends IntersectionType(StreamDto, BaseCreateDto) { }

export class UpdateStreamDto extends PartialType(CreateStreamDto) { }
