import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { JwtPayloadDto, UserAccountDto } from "../../models/user-account.dto";

export const CurrentUserAccount = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext): UserAccountDto => {
		const payload = ctx
			.switchToHttp()
			.getRequest<Request & { user: JwtPayloadDto }>().user;
		const user = payload.user;
		return user;
	},
);
