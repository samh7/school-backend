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
import { CreateStaffDto } from "./7.StaffDto";
import { RoleEnum } from "./Types/RoleEnum";

export class ChangePasswordDto {
	@IsString()
	CurrentPassword: string;
	@IsString()
	NewPassword: string;
}

export class ResetPasswordDto {
	@IsString()
	StaffId: string;
}

export class CreateSystemAdminDto {
	@IsString()
	Email: string;

	@IsString()
	Password: string;

	@IsEnum(RoleEnum)
	Role: RoleEnum;
}

export class LoginDto {
	@IsString()
	Email: string;
	@IsString()
	Password: string;
}

export class CreateFroStaffDto {
	@Expose()
	@IsEnum(RoleEnum)
	Role: RoleEnum;
	@IsString()
	@Expose()
	StaffId: string;
}

export class UserAccountDto {
	@IsString()
	@Expose()
	Id: string;
	@IsString()
	@Expose()
	Email: string;
	@IsEnum(RoleEnum)
	@Expose()
	Role: RoleEnum;
	@IsBoolean()
	IsActive: boolean;
	@Expose()
	@IsDateString()
	LastLogin: Date;

	@Expose()
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateStaffDto)
	Staff?: CreateStaffDto;

	@Expose()
	@IsString()
	@IsOptional()
	StaffId?: string;

	@Expose()
	@IsString()
	@IsOptional()
	SchoolId?: string;
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
