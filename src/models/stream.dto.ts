import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { BaseDto, BASE_DTO_KEYS } from "./base.dto";

export class StreamDto extends BaseDto {
	@Expose()
	@IsString()
	gradeLevelId: string;

	@Expose()
	@IsString()
	name: string; // e.g. "North"

	@Expose()
	@IsNumber()
	@IsOptional()
	capacity?: number;
}

export class CreateStreamDto extends OmitType(StreamDto, BASE_DTO_KEYS) {}

export class UpdateStreamDto extends PartialType(CreateStreamDto) {}
