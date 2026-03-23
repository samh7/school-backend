import { Expose, Type } from "class-transformer";
import {
	IsBoolean,
	IsDateString,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";
import { CreateStaffDto } from "./staff.dto";
import { RoleEnum } from "./types/role-enum";

export class ChangePasswordDto {
	@IsString()
	currentPassword: string;
	@IsString()
	newPassword: string;
}

export class ResetPasswordDto {
	@IsString()
	staffId: string;
}

export class CreateSystemAdminDto {
	@IsString()
	email: string;

	@IsString()
	password: string;

	@IsEnum(RoleEnum)
	role: RoleEnum;
}

export class LoginDto {
	@IsString()
	email: string;
	@IsString()
	password: string;
}

export class CreateFroStaffDto {
	@Expose()
	@IsEnum(RoleEnum)
	role: RoleEnum;
	@IsString()
	@Expose()
	staffId: string;
}

export class UserAccountDto {
	@IsString()
	@Expose()
	id: string;
	@IsString()
	@Expose()
	email: string;
	@IsEnum(RoleEnum)
	@Expose()
	role: RoleEnum;
	@IsBoolean()
	isActive: boolean;
	@Expose()
	@IsDateString()
	lastLogin: Date;

	@Expose()
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateStaffDto)
	staff?: CreateStaffDto;

	@Expose()
	@IsString()
	@IsOptional()
	staffId?: string;

	@Expose()
	@IsString()
	@IsOptional()
	schoolId?: string;
}

export class JwtPayloadDto {
	@Expose()
	@ValidateNested()
	@Type(() => UserAccountDto)
	user: UserAccountDto;

	@IsString()
	@Expose()
	jti: string;

	@IsString()
	@Expose()
	sub: string;

	@IsNumber()
	@Expose()
	generation: number;
}
