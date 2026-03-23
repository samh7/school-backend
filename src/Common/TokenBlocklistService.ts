import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class TokenBlocklistService {
	constructor(@InjectRedis() private readonly redis: Redis) {}

	// Call on logout or password change — invalidates the specific token
	async block(jti: string, ttlSeconds: number): Promise<void> {
		await this.redis.set(`blocklist:${jti}`, "1", "EX", ttlSeconds);
	}

	async isBlocked(jti: string): Promise<boolean> {
		const result = await this.redis.get(`blocklist:${jti}`);
		return result !== null;
	}

	// Call on password reset — invalidates ALL tokens for a user
	async blockAllForUser(userId: string): Promise<void> {
		// Store a "generation" counter per user — JwtStrategy checks this
		// Any token issued before the current generation is rejected
		await this.redis.incr(`token-gen:${userId}`);
	}

	async getGeneration(userId: string): Promise<number> {
		const gen = await this.redis.get(`token-gen:${userId}`);
		return gen ? parseInt(gen, 10) : 0;
	}
}
