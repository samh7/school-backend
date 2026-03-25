import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { JwtPayloadDto, UserAccountDto } from "../../models/user-account.dto";

export const CurrentUserAccount = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext): UserAccountDto => {
		const request: Request = ctx.switchToHttp().getRequest();
		const payload = request.user as unknown as JwtPayloadDto;
		return payload.user;
	},
);
