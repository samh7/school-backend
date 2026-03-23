import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisHealthService implements OnModuleInit {
	constructor(@InjectRedis() private readonly redis: Redis) {}

	async onModuleInit() {
		try {
			await this.redis.ping();
			console.log("Redis connected");
		} catch (_error) {
			console.error("Redis connection failed");
			process.exit(1); // crash immediately
		}
	}
}
