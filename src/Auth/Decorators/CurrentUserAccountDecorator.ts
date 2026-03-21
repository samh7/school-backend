import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAccount } from "../../Models/13.UserAccountEntity";

export const CurrentUserAccount = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext): UserAccount => {
		const request = ctx.switchToHttp().getRequest();
		return request.user;
	},
);
