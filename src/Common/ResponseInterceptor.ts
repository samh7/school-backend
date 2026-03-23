import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { v4 as uuidv4 } from "uuid";

const EXCLUDED_FIELDS = new Set(["PasswordHash", "TempPassword", "DeletedAt"]);

interface SuccessResponse<T> {
	success: true;
	requestId: string;
	statusCode: number;
	data: T;
	timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
	T,
	SuccessResponse<T>
> {
	intercept(
		ctx: ExecutionContext,
		next: CallHandler<T>,
	): Observable<SuccessResponse<T>> {
		const request = ctx.switchToHttp().getRequest<Request>();
		const requestId =
			(request.headers as unknown as Record<string, string>)["x-request-id"] ??
			uuidv4();

		return next.handle().pipe(
			map((data) => ({
				success: true as const,
				requestId,
				statusCode: ctx.switchToHttp().getResponse<Response>().status,
				data: this.stripFields(data) as T,
				timestamp: new Date().toISOString(),
			})),
		);
	}

	private stripFields(data: unknown): unknown {
		if (data === null || data === undefined) return data;

		if (Array.isArray(data)) return data.map((item) => this.stripFields(item));

		if (typeof data === "object") {
			return Object.fromEntries(
				Object.entries(data as Record<string, unknown>)
					.filter(([key]) => !EXCLUDED_FIELDS.has(key))
					.map(([key, value]) => [key, this.stripFields(value)]),
			);
		}

		return data;
	}
}
