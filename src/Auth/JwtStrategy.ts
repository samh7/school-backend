import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { EnvironmentVariables } from "../Config/EnvTypes";
import { UserAccountDto } from "../Models/13.UserAccountDto";
import { AuthService } from "./AuthService";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(
		private readonly authService: AuthService,
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

	async validate(payload: UserAccountDto) {
		const user = payload;

		const account = await this.authService._status(user);

		if (!account) {
			throw new UnauthorizedException("User not found.");
		}
		return user;
	}
}
