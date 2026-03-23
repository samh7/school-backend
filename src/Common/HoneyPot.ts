import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import Redis from "ioredis";

@Injectable()
export class HoneypotMiddleware implements NestMiddleware {
	private readonly logger = new Logger("Honeypot");

	constructor(@InjectRedis() private readonly redis: Redis) {}

	async use(req: Request, res: Response): Promise<void> {
		const ip = req.ip ?? "unknown";

		this.logger.warn({
			type: "HoneypotTriggered",
			ip,
			path: req.url,
			method: req.method,
			ua: req.headers["user-agent"],
		});

		await this.redis.set(`blocked-ip:${ip}`, "1", "EX", 86400);

		res.status(200).json({ message: "OK" });
	}
}
