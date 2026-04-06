import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import {
	ChangePasswordDto,
	CreateSystemAdminDto,
	LoginDto,
	UserAccountDto,
} from "../models/user-account.dto";
import { AuthService } from "./auth.service";
import { CurrentUserAccount } from "./decorators/current-user-account.decorator";
import { GetAuthToken } from "./decorators/get-auth-token.decorator";
import { IsPublic } from "./decorators/is-public.decorator";
import { SkipBlockedUserCheck } from "./decorators/skip-blocked-user-check.decorator";

@ApiBearerAuth()
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@IsPublic()
	@SkipBlockedUserCheck()
	@Post("register")
	register(@Body() createSystemAdminDto: CreateSystemAdminDto) {
		return this.authService.createSystemAdmin(createSystemAdminDto);
	}

	@IsPublic()
	@SkipBlockedUserCheck()
	@Post("login")
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@Get("me")
	getMe(@CurrentUserAccount() userAccount: UserAccountDto) {
		return userAccount;
	}

	@Post("logout")
	logout(
		@CurrentUserAccount() userAccount: UserAccountDto,
		@GetAuthToken() authToken: string,
	) {
		return this.authService.logout(userAccount, authToken);
	}

	@Put("change-password")
	changePassword(
		@CurrentUserAccount() userAccount: UserAccountDto,
		@GetAuthToken() authToken: string,
		@Body() dto: ChangePasswordDto,
	) {
		return this.authService.changePassword(userAccount, authToken, dto);
	}
}
