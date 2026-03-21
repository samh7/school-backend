import { Controller, Get, Param, Post } from "@nestjs/common";
import { ChangePasswordDto, CreateSystemAdminDto, ResetPasswordDto } from "../Models/13.UserAccountDto";
import { RoleEnum } from "../Models/Types/RoleEnum";
import { UserAccountService } from "./8.UserAccountService";

@Controller("user-accounts")
export class UserAccountController {
	constructor(private readonly userAccountService: UserAccountService) { }

	@Post("create/system-admin")
	createSystemAdmin(createSystemAdminDto: CreateSystemAdminDto) {
		return this.userAccountService.createSystemAdmin(createSystemAdminDto);
	}

	@Post("create/for-staff")
	createForStaff({ Role, StaffId }: { Role: RoleEnum, StaffId: string; }) {
		return this.userAccountService.CreateForStaff(StaffId, Role);
	}

	@Get("one/:id")
	findOne(@Param("id") id: string) {
		return this.userAccountService.findOne(id);
	}

	@Get("one/email/:email")
	findByEmail(@Param("email") email: string) {
		return this.userAccountService.findByEmail(email);
	}

	@Post("change-password/:id")
	changePassword(@Param("id") id: string, changePasswordDto: ChangePasswordDto) {
		return this.userAccountService.changePassword(id, changePasswordDto);
	}

	@Post("reset-password")
	resetPassword(resetPasswordDto: ResetPasswordDto) {
		return this.userAccountService.resetPassword(resetPasswordDto);
	}

	@Post("toggle-active/:id")
	toggleActive(@Param("id") id: string) {
		return this.userAccountService.toggleActive(id);
	}


}
