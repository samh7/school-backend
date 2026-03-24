import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Roles } from "../auth/decorators/role.decorator";
import { RoleEnum } from "../models/types/role-enum";
import {
	ChangePasswordDto,
	CreateFroStaffDto,
	CreateSystemAdminDto,
	ResetPasswordDto,
} from "../models/user-account.dto";
import { UserAccountService } from "./user-account.service";

@Roles(RoleEnum.SCHOOL_ADMIN)
@Controller("user-accounts")
export class UserAccountController {
	constructor(private readonly userAccountService: UserAccountService) {}

	@Post("create/system-admin")
	createSystemAdmin(@Body() createSystemAdminDto: CreateSystemAdminDto) {
		return this.userAccountService.createSystemAdmin(createSystemAdminDto);
	}

	@Post("create/for-staff")
	createForStaff(@Body() createFroStaffDto: CreateFroStaffDto) {
		return this.userAccountService.CreateForStaff(
			createFroStaffDto.staffId,
			createFroStaffDto.role,
		);
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
	changePassword(
		@Param("id") id: string,
		@Body() changePasswordDto: ChangePasswordDto,
	) {
		return this.userAccountService.changePassword(id, changePasswordDto);
	}

	@Post("reset-password")
	resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
		return this.userAccountService.resetPassword(resetPasswordDto);
	}

	@Post("toggle-active/:id")
	toggleActive(@Param("id") id: string) {
		return this.userAccountService.toggleActive(id);
	}
}
