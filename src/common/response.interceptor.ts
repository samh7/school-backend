import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { Response } from "express";
import { map, Observable } from "rxjs";
import { v4 as uuidv4 } from "uuid";

const _EXCLUDED_FIELDS = new Set(["passwordHash", "tempPassword", "deletedAt"]);

interface ISuccessResponse<T> {
	success: true;
	requestId: string;
	statusCode: number;
	data: T;
	timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
	T,
	ISuccessResponse<T>
> {
	intercept(
		ctx: ExecutionContext,
		next: CallHandler<T>,
	): Observable<ISuccessResponse<T>> {
		const request = ctx.switchToHttp().getRequest<Request>();
		const requestId =
			(request.headers as unknown as Record<string, string>)["x-request-id"] ??
			uuidv4();

		return next.handle().pipe(
			map((data) => ({
				success: true as const,
				requestId,
				statusCode: ctx.switchToHttp().getResponse<Response>().statusCode,
				data,
				timestamp: new Date().toISOString(),
			})),
		);
	}
}
