import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { BASE_DTO_KEYS, BaseDto } from "./0.BaseDto";

export class StreamDto extends BaseDto {
	@Expose()
	@IsString()
	GradeLevelId: string;

	@Expose()
	@IsString()
	Name: string; // e.g. "North"

	@Expose()
	@IsNumber()
	@IsOptional()
	Capacity?: number;
}

export class CreateStreamDto extends OmitType(StreamDto, BASE_DTO_KEYS) {}

export class UpdateStreamDto extends PartialType(CreateStreamDto) {}
