import { InjectRedis } from "@nestjs-modules/ioredis";
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import Redis from "ioredis";
import { JwtPayloadDto } from "../models/user-account.dto";
export const SKIP_BLOCKED_USER_CHECK = "skipBlockedUserCheck";
@Injectable()
export class BlockedUserGuard implements CanActivate {
	constructor(
		@InjectRedis() private readonly redis: Redis,
		private readonly reflector: Reflector,
	) {}

	async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const skipCheck = this.reflector.getAllAndOverride<boolean>(
			SKIP_BLOCKED_USER_CHECK,
			[ctx.getHandler(), ctx.getClass()],
		);

		if (skipCheck) {
			return true;
		}

		const payload = ctx
			.switchToHttp()
			.getRequest<Request & { user: JwtPayloadDto }>().user;

		const user = payload.user;

		const blocked = await this.redis.get(`blocked-user:${user.id}`);

		if (blocked)
			throw new ForbiddenException("Your account has been suspended");

		return true;
	}
}
