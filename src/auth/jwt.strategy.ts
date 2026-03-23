import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenBlocklistService } from "../common/token-blocklist.service";
import { EnvironmentVariables } from "../config/env-types";
import { JwtPayloadDto } from "../models/user-account.dto";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(
		private readonly authService: AuthService,
		private readonly tokenBlocklist: TokenBlocklistService,
		readonly configService: ConfigService<EnvironmentVariables>,
	) {
		const jwtSecret = configService.getOrThrow<string>(
			"JWT_ACCESS_TOKEN_SECRET",
		);
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtSecret,
		});
	}

	async validate(payload: JwtPayloadDto): Promise<JwtPayloadDto> {
		// 1. Check if this specific token has been blocklisted (logout)
		const blocked = await this.tokenBlocklist.isBlocked(payload.jti);
		if (blocked) throw new UnauthorizedException("Token has been invalidated");

		// 2. Check generation (password change — invalidates all sessions)
		const currentGen = await this.tokenBlocklist.getGeneration(payload.sub);
		if (payload.generation < currentGen) {
			throw new UnauthorizedException("Token has been invalidated");
		}
		if (
			!payload.user ||
			payload.user.email ||
			payload.user.id ||
			payload.generation ||
			payload.sub ||
			payload.jti
		)
			throw new UnauthorizedException("User is not authenticated");
		// 3. Check user still exists and is active
		const account = await this.authService._status(payload.user);
		if (!account) throw new UnauthorizedException("User not found.");

		return payload;
	}
}
