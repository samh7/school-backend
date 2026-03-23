import {
	Body,
	Controller,
	Get,
	Headers,
	Post,
	Put,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserAccountService } from "../Controllers/8.UserAccountService";
import {
	ChangePasswordDto,
	CreateSystemAdminDto,
	LoginDto,
	UserAccountDto,
} from "../Models/13.UserAccountDto";
import { AuthService } from "./AuthService";
import { CurrentUserAccount } from "./Decorators/CurrentUserAccountDecorator";
import { JwtAuthGuard } from "./JwtGuard";

@ApiBearerAuth()
@Controller("auth")
export class AuthController {
	constructor(
		private readonly userAccountService: UserAccountService,
		private readonly authService: AuthService,
	) {}

	@Post("register")
	register(@Body() createSystemAdminDto: CreateSystemAdminDto) {
		return this.userAccountService.createSystemAdmin(createSystemAdminDto);
	}

	@Post("login")
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@UseGuards(JwtAuthGuard)
	@Get("me")
	getMe(@CurrentUserAccount() userAccount: UserAccountDto) {
		return userAccount;
	}

	@Post("logout")
	@UseGuards(JwtAuthGuard)
	logout(
		@CurrentUserAccount() user: UserAccountDto,
		@Headers("authorization") auth: string,
	) {
		const token = auth.replace("Bearer ", "");
		return this.authService.logout(user, token);
	}

	@Put("change-password")
	@UseGuards(JwtAuthGuard)
	changePassword(
		@CurrentUserAccount() user: UserAccountDto,
		@Headers("authorization") auth: string,
		@Body() dto: ChangePasswordDto,
	) {
		const token = auth.replace("Bearer ", "");
		return this.authService.changePassword(user, token, dto);
	}
}
