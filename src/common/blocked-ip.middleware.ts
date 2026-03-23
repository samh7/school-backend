import { InjectRedis } from "@nestjs-modules/ioredis";
import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import Redis from "ioredis";

@Injectable()
export class BlockedIpMiddleware implements NestMiddleware {
	constructor(@InjectRedis() private readonly redis: Redis) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";

		const blocked = await this.redis.get(`blocked-ip:${ip}`);

		if (blocked) {
			throw new ForbiddenException("Your IP has been blocked");
		}

		next();
	}
}
