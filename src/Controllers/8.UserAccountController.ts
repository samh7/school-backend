import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "../Auth/Decorators/RoleDecorator";
import { JwtAuthGuard } from "../Auth/JwtGuard";
import {
	ChangePasswordDto,
	CreateFroStaffDto,
	CreateSystemAdminDto,
	ResetPasswordDto,
} from "../Models/13.UserAccountDto";
import { RoleEnum } from "../Models/Types/RoleEnum";
import { UserAccountService } from "./8.UserAccountService";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
