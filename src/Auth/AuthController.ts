import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserAccountService } from "../Controllers/8.UserAccountService";
import {
	CreateSystemAdminDto,
	LoginDto,
	UserAccountDto,
} from "../Models/13.UserAccountDto";
import { AuthService } from "./AuthService";
import { CurrentUserAccount } from "./Decorators/CurrentUserAccountDecorator";
import { JwtAuthGuard } from "./JwtGuard";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly userAccountService: UserAccountService,
		private readonly authService: AuthService,
	) {}

	@Post("register")
	register(@Body() CreateSystemAdminDto: CreateSystemAdminDto) {
		return this.userAccountService.createSystemAdmin(CreateSystemAdminDto);
	}

	@Post("login")
	login(@Body() LoginDto: LoginDto) {
		return this.authService.login(LoginDto);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Get("me")
	getMe(@CurrentUserAccount() userAccount: UserAccountDto) {
		return userAccount;
	}

	// @ApiBearerAuth()
	// @UseGuards(JwtAuthGuard)
	// @Get('verify-email/:code')
	// verifyEmail(@Param('code') code: string) {
	// }

	// @ApiBearerAuth()
	// @UseGuards(JwtAuthGuard)
	// @Get("reset-password-token/:email")
	// getResetPasswordToken(@Param("email") email: string) {
	// }

	// @ApiBearerAuth()
	// @UseGuards(JwtAuthGuard)
	// @Post("reset-password")
	// resetPasswordToken(@Body() changePasswordDto: ChangePasswordDto) {

	// }
}
