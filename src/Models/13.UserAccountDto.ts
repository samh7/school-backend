import { Staff } from "./7.StaffEntity";
import { RoleEnum } from "./Types/RoleEnum";

export class ChangePasswordDto {
	CurrentPassword: string;
	NewPassword: string;
}

export class ResetPasswordDto {
	StaffId: string;
}


export class CreateSystemAdminDto {
	Email: string;
	PasswordHash: string;
	Role: RoleEnum;
}


export class LoginDto {
	Email: string;
	Password: string;
}


export class UserAccountDto {
	Id: string;
	Email: string;
	Role: RoleEnum;
	IsActive: boolean;
	LastLogin: Date;
	Staff?: Staff;
	StaffId?: string;
	SchoolId?: string;
}
