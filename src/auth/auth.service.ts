import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";
import { v4 as uuidv4 } from "uuid";
import { TokenBlocklistService } from "../common/token-blocklist.service";
import { UserAccountService } from "../controllers/user-account.service";
import {
	ChangePasswordDto,
	JwtPayloadDto,
	LoginDto,
	UserAccountDto,
} from "../models/user-account.dto";
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
			account.id,
		);
		const payload: Omit<JwtPayloadDto, "exp"> = {
			user: {
				email: account.email,
				id: account.id,
				role: account.role,
				staffId: account.staffId,
				isActive: account.isActive,
				lastLogin: account.lastLogin,
				schoolId: account.staff?.schoolId,
				createdAt: account.createdAt,
			},
			jti: uuidv4(),
			sub: account.id,
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
		const decoded = this.jwtService.decode<JwtPayloadDto>(token);

		if (decoded?.jti) {
			// TTL = remaining time until token naturally expires
			const ttl = decoded.exp - Math.floor(Date.now() / 1000);
			if (ttl > 0) {
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
			email: user.email,
			password: dto.currentPassword,
		});

		if (!isMatch)
			throw new UnauthorizedException("Current password is incorrect");

		const newHash = await bcrypt.hash(dto.newPassword, 12);

		await this.userAccountService._updatePassword(user.id, newHash);

		const decoded = this.jwtService.decode<JwtPayloadDto>(token);

		const ttl = decoded.exp - Math.floor(Date.now() / 1000);

		if (ttl > 0) await this.tokenBlocklistService.block(decoded.jti, ttl);

		// 6. Invalidate ALL other tokens for this user (increment generation)
		await this.tokenBlocklistService.blockAllForUser(user.id);

		return { message: "Password changed successfully. Please log in again." };
	}
	async _status(userAccount: UserAccountDto) {
		if (!userAccount) {
			throw new UnauthorizedException("UserAccount not found");
		}
		const account = await this.userAccountService.findOne(userAccount.id);
		if (!account) {
			throw new UnauthorizedException("UserAccount not found");
		}

		// Use .getTime() to compare the underlying unix timestamp in milliseconds
		const dtoTime = new Date(userAccount.createdAt).getTime();
		const dbTime = new Date(account.createdAt).getTime();

		// This checks year, month, day, hour, minute, second, AND millisecond
		if (dtoTime !== dbTime)
			throw new UnauthorizedException("Session expired log in again");

		return account;
	}
}
