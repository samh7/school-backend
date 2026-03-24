import { Body, Controller, Get, Headers, Post, Put } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserAccountService } from "../controllers/user-account.service";
import {
	ChangePasswordDto,
	CreateSystemAdminDto,
	LoginDto,
	UserAccountDto,
} from "../models/user-account.dto";
import { AuthService } from "./auth.service";
import { CurrentUserAccount } from "./decorators/current-user-account.decorator";
import { IsPublic } from "./decorators/is-public.decorator";

@ApiBearerAuth()
@Controller("auth")
export class AuthController {
	constructor(
		private readonly userAccountService: UserAccountService,
		private readonly authService: AuthService,
	) {}

	@IsPublic()
	@Post("register")
	register(@Body() createSystemAdminDto: CreateSystemAdminDto) {
		return this.userAccountService.createSystemAdmin(createSystemAdminDto);
	}

	@IsPublic()
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
		@CurrentUserAccount() user: UserAccountDto,
		@Headers("authorization") auth: string,
	) {
		const token = auth.replace("Bearer ", "");
		return this.authService.logout(user, token);
	}

	@Put("change-password")
	changePassword(
		@CurrentUserAccount() user: UserAccountDto,
		@Headers("authorization") auth: string,
		@Body() dto: ChangePasswordDto,
	) {
		const token = auth.replace("Bearer ", "");
		return this.authService.changePassword(user, token, dto);
	}
}
