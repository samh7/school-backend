import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { plainToInstance } from "class-transformer";
import { UserAccountService } from "../Controllers/8.UserAccountService";
import { LoginDto, UserAccountDto } from "../Models/13.UserAccountDto";
@Injectable()
export class AuthService {
	constructor(
		private readonly userAccountService: UserAccountService,
		private readonly jwtService: JwtService,
	) {}

	async login(loginDto: LoginDto) {
		const account = await this.userAccountService._login(loginDto);

		const payload: UserAccountDto = {
			Email: account.Email,
			Id: account.Id,
			Role: account.Role,
			StaffId: account.StaffId,
			IsActive: account.IsActive,
			LastLogin: account.LastLogin,
			SchoolId: account.Staff?.SchoolId,
		};

		const accessToken = this.jwtService.sign(payload);

		const user = plainToInstance(UserAccountDto, account);
		return { user, accessToken };
	}

	async _status(userAccount: UserAccountDto) {
		if (!userAccount) {
			throw new UnauthorizedException("UserAccount not found");
		}
		const account = await this.userAccountService.findOne(userAccount.Id);
		if (!account) {
			throw new UnauthorizedException("UserAccount not found");
		}

		return account;
	}
}
