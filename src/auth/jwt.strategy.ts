import { InjectRedis } from "@nestjs-modules/ioredis";
import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import Redis from "ioredis";
import { ExtractJwt, Strategy } from "passport-jwt";
import { USER_CACHE_KEY_PREFIX } from "../common/CONSTANTS";
import { TokenBlocklistService } from "../common/token-blocklist.service";
import { EnvVariables } from "../config/env-types";
import { JwtPayloadDto, UserAccountDto } from "../models/user-account.dto";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(
		private readonly authService: AuthService,
		private readonly tokenBlocklist: TokenBlocklistService,
		readonly configService: ConfigService<EnvVariables, true>,
		@InjectRedis() private readonly redis: Redis,
	) {
		const jwtSecret = configService.get<string>("JWT_ACCESS_TOKEN_SECRET");
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtSecret,
		});
	}

	async validate(payload: JwtPayloadDto): Promise<JwtPayloadDto> {
		// check redis for cached user
		const userId = payload.sub;
		const cacheKey = `${USER_CACHE_KEY_PREFIX}:${userId}`;
		const cachedUser = (await this.redis.get(cacheKey)) as string;
		let user: UserAccountDto;

		if (cachedUser) {
			user = JSON.parse(cachedUser) as UserAccountDto;
		} else {
			// Cache Miss: Hit the DB via _status check
			const account = await this.authService._status(payload.user);
			if (!account) throw new UnauthorizedException("User not found");

			user = account;
			// Save to Redis with a TTL
			await this.redis.set(cacheKey, JSON.stringify(user), "EX", 600);
		}

		// mandatory security checks for cached and non cached users

		if (!user) throw new NotFoundException("User not found!");
		const blocked = await this.tokenBlocklist.isBlocked(payload.jti);
		if (blocked) throw new UnauthorizedException("Token has been invalidated");

		const currentGen = await this.tokenBlocklist.getGeneration(userId);
		if (payload.generation < currentGen) {
			throw new UnauthorizedException("Token has been invalidated");
		}

		return payload;
	}
}
