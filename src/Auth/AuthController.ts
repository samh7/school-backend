import { Body, Controller, Post } from "@nestjs/common";
import { UserAccountService } from "../Controllers/8.UserAccountService";
import { CreateSystemAdminDto, LoginDto } from "../Models/13.UserAccountDto";
import { AuthService } from "./AuthService";

@Controller('auth')
export class AuthController {
	constructor(private readonly userAccountService: UserAccountService,
		private readonly authService: AuthService
	) { }

	@Post("register")
	register(@Body() CreateSystemAdminDto: CreateSystemAdminDto) {
		return this.userAccountService.createSystemAdmin(CreateSystemAdminDto);
	}


	@Post("login")
	login(@Body() LoginDto: LoginDto) {
		return this.authService.login(LoginDto);
	}


	// @UseGuards(JwtAuthGuard)
	// @Get('status')
	// async status(@Req() req: Request) {

	// }

	// @Get('verify-email/:code')
	// verifyEmail(@Param('code') code: string) {
	// }

	// @Get("reset-password-token/:email")
	// getResetPasswordToken(@Param("email") email: string) {
	// }


	// @Post("reset-password")
	// resetPasswordToken(@Body() changePasswordDto: ChangePasswordDto) {

	// }

}
