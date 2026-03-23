import { InjectRedis } from "@nestjs-modules/ioredis";
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import Redis from "ioredis";
import { UserAccountDto } from "../Models/13.UserAccountDto";

@Injectable()
export class BlockedUserGuard implements CanActivate {
	constructor(@InjectRedis() private readonly redis: Redis) {}

	async canActivate(ctx: ExecutionContext): Promise<boolean> {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const user = ctx.switchToHttp().getRequest().user as UserAccountDto;
		if (!user) return true;

		const blocked = await this.redis.get(`blocked-user:${user.id}`);
		if (blocked)
			throw new ForbiddenException("Your account has been suspended");

		return true;
	}
}
