import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const GetAuthToken = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): string | null => {
		const request = ctx.switchToHttp().getRequest<Request>();
		if (!request.headers.authorization) return null;
		return request.headers.authorization.split(" ")[1];
	},
);
