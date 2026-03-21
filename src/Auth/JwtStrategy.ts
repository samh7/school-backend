import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvironmentVariables } from "../Config/EnvTypes";
import { AuthService } from "./AuthService";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(
		private readonly authService: AuthService,
		readonly configService: ConfigService<EnvironmentVariables>
	) {
		const jwtSecret = configService.getOrThrow("JWT_ACCESS_TOKEN_SECRET");

		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtSecret,
		});
	}

	async validate(payload: any) {
		const user = payload.user;
		const account = await this.authService.status(user);
		if (!account) {
			throw new UnauthorizedException("User not found.");
		}
		return user;
	}
}
