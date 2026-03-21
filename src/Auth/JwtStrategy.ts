import { EnvSchema } from "#/common/env.schema";
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(
		private readonly authService: AuthService,
		private readonly ConfigService: ConfigService<EnvSchema>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: ConfigService.get("JWT_ACCESS_TOKEN_SECRET"),
		});
	}
	async validate(payload: any) {

		const user = payload.user;
		const dbUser = this.authService.status(user);
		if (!dbUser) {
			throw new UnauthorizedException("User not found.");
		}
		return user;
	}
}
