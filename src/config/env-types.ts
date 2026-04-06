import { Type } from "class-transformer";
import {
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUrl,
	Min,
} from "class-validator";

export class EnvVariables {
	@IsString()
	@IsNotEmpty()
	DATABASE_URL!: string;

	@IsEnum(["development", "production", "test"])
	NODE_ENV!: "development" | "production" | "test";

	@Type(() => Number)
	@IsNumber()
	@IsInt()
	@Min(1)
	PORT!: number;

	@IsString()
	@IsNotEmpty()
	JWT_ACCESS_TOKEN_SECRET!: string;

	@IsString()
	@IsNotEmpty()
	JWT_EXPIRES_IN!: string;

	@IsString()
	@IsNotEmpty()
	REDIS_HOST!: string;

	@Type(() => Number)
	@IsNumber()
	@IsInt()
	REDIS_PORT!: number;

	@IsString()
	@IsOptional()
	REDIS_PASSWORD?: string;

	@Type(() => Number)
	@IsNumber()
	@IsInt()
	@Min(0)
	REDIS_DB!: number;

	@IsUrl()
	FRONTEND_URL!: string;
}
