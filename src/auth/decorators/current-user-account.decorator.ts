import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { UserAccountDto } from "../../models/user-account.dto";

export const CurrentUserAccount = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext): UserAccountDto => {
		const request: Request = ctx.switchToHttp().getRequest();
		return request.user as UserAccountDto;
	},
);
