import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";
import { v4 as uuidv4 } from "uuid";
import { TokenBlocklistService } from "../Common/TokenBlocklistService";
import { UserAccountService } from "../Controllers/8.UserAccountService";
import {
	ChangePasswordDto,
	JwtPayloadDto,
	LoginDto,
	UserAccountDto,
} from "../Models/13.UserAccountDto";
@Injectable()
export class AuthService {
	constructor(
		private readonly userAccountService: UserAccountService,
		private readonly jwtService: JwtService,

		private readonly tokenBlocklistService: TokenBlocklistService,
	) {}

	async login(loginDto: LoginDto) {
		const account = await this.userAccountService._login(loginDto);
		const generation = await this.tokenBlocklistService.getGeneration(
			account.Id,
		);
		const payload: JwtPayloadDto = {
			user: {
				Email: account.Email,
				Id: account.Id,
				Role: account.Role,
				StaffId: account.StaffId,
				IsActive: account.IsActive,
				LastLogin: account.LastLogin,
				SchoolId: account.Staff?.SchoolId,
			},
			jti: uuidv4(),
			sub: account.Id,
			generation,
		};

		const accessToken = this.jwtService.sign(payload);

		const user = plainToInstance(UserAccountDto, account);
		return { user, accessToken };
	}

	async logout(
		user: UserAccountDto,
		token: string,
	): Promise<{ message: string }> {
		// Decode to get jti and expiry
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const decoded = this.jwtService.decode(token);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (decoded?.jti) {
			// TTL = remaining time until token naturally expires
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			const ttl = decoded.exp - Math.floor(Date.now() / 1000);
			if (ttl > 0) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
				await this.tokenBlocklistService.block(decoded.jti, ttl);
			}
		}

		return { message: "Logged out successfully" };
	}

	async changePassword(
		user: UserAccountDto,
		token: string,
		dto: ChangePasswordDto,
	): Promise<{ message: string }> {
		const isMatch = await this.userAccountService._login({
			Email: user.Email,
			Password: dto.CurrentPassword,
		});

		if (!isMatch)
			throw new UnauthorizedException("Current password is incorrect");

		const newHash = await bcrypt.hash(dto.NewPassword, 12);

		await this.userAccountService._updatePassword(user.Id, newHash);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const decoded = this.jwtService.decode(token);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const ttl = decoded.exp - Math.floor(Date.now() / 1000);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
		if (ttl > 0) await this.tokenBlocklistService.block(decoded.jti, ttl);

		// 6. Invalidate ALL other tokens for this user (increment generation)
		await this.tokenBlocklistService.blockAllForUser(user.Id);

		return { message: "Password changed successfully. Please log in again." };
	}
	async _status(userAccount: UserAccountDto) {
		if (!userAccount) {
			throw new UnauthorizedException("UserAccount not found");
		}
		console.log("userAccount.user.Id", userAccount);
		const account = await this.userAccountService.findOne(userAccount.Id);
		if (!account) {
			throw new UnauthorizedException("UserAccount not found");
		}

		return account;
	}
}
