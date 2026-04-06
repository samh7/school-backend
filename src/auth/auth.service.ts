import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { plainToInstance } from "class-transformer";
import { TokenBlocklistService } from "../common/token-blocklist.service";
import { UserAccountService } from "../controllers/user-account.service";
import {
	ChangePasswordDto,
	CreateSystemAdminDto,
	JwtPayloadDto,
	LoginDto,
	UserAccountDto,
} from "../models/user-account.dto";
import { createPayload, hashPassword } from "./utils/auth";
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
		const payload = createPayload(account, generation);

		const accessToken = this.jwtService.sign(payload);

		const user = plainToInstance(UserAccountDto, account);
		return { user, accessToken };
	}

	async createSystemAdmin(createSystemAdminDto: CreateSystemAdminDto) {
		return this.userAccountService.createSystemAdmin(createSystemAdminDto);
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

		const newHash = await hashPassword(dto.newPassword);

		await this.userAccountService._updatePassword(user.id, newHash);

		const decoded = this.jwtService.decode<JwtPayloadDto>(token);

		const ttl = decoded.exp - Math.floor(Date.now() / 1000);

		if (ttl > 0) await this.tokenBlocklistService.block(decoded.jti, ttl);

		// 6. Invalidate ALL other tokens for this user (increment generation)
		await this.tokenBlocklistService.blockAllForUser(user.id);

		return { message: "Password changed successfully. Please log in again." };
	}
	async _status(userAccount: UserAccountDto) {
		const account = await this.userAccountService.findOne(userAccount.id);
		return account;
	}
}
