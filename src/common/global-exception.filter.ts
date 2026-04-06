import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
	PayloadTooLargeException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { EntityNotFoundError, QueryFailedError } from "typeorm";
import { v4 as uuidv4 } from "uuid";

interface IHttpExceptionResponse {
	message: string | string[];
	statusCode?: number;
	error?: string;
}

export interface IAuthenticatedRequest extends Request {
	user?: {
		id: string;
	};
}

interface IPostgresQueryError extends QueryFailedError {
	code: string;
	detail: string;
	query: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger("ExceptionFilter");

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<IAuthenticatedRequest>();
		const response = ctx.getResponse<Response>();
		const requestId = (request.headers["x-request-id"] as string) ?? uuidv4();
		const path = request.path;
		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = "Something went wrong. Please try again later.";

		// Known HTTP exceptions (thrown by your code)
		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const res = exception.getResponse();

			if (typeof res === "object" && res !== null && "message" in res) {
				const typedRes = res as IHttpExceptionResponse;
				message = Array.isArray(typedRes.message)
					? typedRes.message[0]
					: typedRes.message;
			} else {
				message = exception.message;
			}
			const dataToLog = {
				requestId,
				status,
				message: exception.message,
				path,
				method: request.method,
				userId: request.user?.id ?? null,
			};

			if (Number(status) >= 500) {
				this.logger.warn({
					...dataToLog,
					body: this.sanitizeBody(request.body as Record<string, unknown>),
				});
			} else {
				this.logger.warn({ ...dataToLog });
			}
		}

		// PayloadTooLargeExeption
		else if (exception instanceof PayloadTooLargeException) {
			return response.status(413).json({
				statusCode: 413,
				message: "Request body too large. Maximum allowed size is 10kb.",
			});
		}

		// TypeORM errors
		else if (exception instanceof QueryFailedError) {
			const pg = exception as IPostgresQueryError;

			if (pg.code === "23505") {
				status = HttpStatus.CONFLICT;
				message = "A record with this information already exists.";
			} else if (pg.code === "23503") {
				status = HttpStatus.BAD_REQUEST;
				message = "Referenced record does not exist.";
			} else if (pg.code === "23502") {
				status = HttpStatus.BAD_REQUEST;
				message = "A required field is missing.";
			}

			this.logger.error({
				requestId,
				type: "QueryFailedError",
				code: pg.code,
				detail: this.sanitizeDetail(pg.detail),
				query: this.sanitizeQuery(pg.query),
				path,
				method: request.method,
				userId: request.user?.id ?? null,
			});
		} else if (exception instanceof EntityNotFoundError) {
			status = HttpStatus.NOT_FOUND;
			message = "The requested record was not found.";

			this.logger.warn({
				requestId,
				type: "EntityNotFoundError",
				path,
				method: request.method,
				userId: request.user?.id ?? null,
			});
		}

		// Unexpected errors — log everything, expose nothing
		else {
			this.logger.error({
				requestId,
				type: "UnhandledException",
				error:
					exception instanceof Error ? exception.message : String(exception),
				stack: exception instanceof Error ? exception.stack : null,
				path,
				method: request.method,
				userId: request.user?.id ?? null,
				body: this.sanitizeBody(request.body as Record<string, unknown>),
			});
		}

		response.status(status).json({
			success: false,
			requestId,
			statusCode: status,
			message,
			timestamp: new Date().toISOString(),
			path,
		});
	}

	private static readonly SENSITIVE = new Set([
		"password",
		"passwordHash",
		"tempPassword",
		"currentPassword",
		"newPassword",
		"token",
		"refreshToken",
	]);

	private sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
		if (!body || typeof body !== "object") return {};

		const recurse = (obj: Record<string, unknown>): Record<string, unknown> =>
			Object.fromEntries(
				Object.entries(obj).map(([key, val]) => {
					if (GlobalExceptionFilter.SENSITIVE.has(key))
						return [key, "[REDACTED]"];
					if (val && typeof val === "object" && !Array.isArray(val))
						return [key, recurse(val as Record<string, unknown>)];
					return [key, val];
				}),
			);

		return recurse(body);
	}
	private sanitizeQuery(query: string): string {
		return query
			.replace(/'[^']*'/g, "'[?]'") // quoted string literals → '[?]'
			.replace(/\b\d+\b/g, "[?]") // standalone numeric literals → [?]
			.substring(0, 300);
	}
	private sanitizeDetail(detail: string | undefined): string | undefined {
		return detail?.replace(/=\([^)]*\)/g, "=(?)");
	}
}
