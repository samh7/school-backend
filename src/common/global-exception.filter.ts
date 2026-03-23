import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { EntityNotFoundError, QueryFailedError } from "typeorm";
import { v4 as uuidv4 } from "uuid";

interface HttpExceptionResponse {
	message: string | string[];
	statusCode?: number;
	error?: string;
}

interface AuthenticatedRequest extends Request {
	user?: {
		Id: string;
	};
}

interface PostgresQueryError extends QueryFailedError {
	code: string;
	detail: string;
	query: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger("ExceptionFilter");

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<AuthenticatedRequest>();
		const response = ctx.getResponse<Response>();
		const requestId = (request.headers["x-request-id"] as string) ?? uuidv4();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = "Something went wrong. Please try again later.";

		// Known HTTP exceptions (thrown by your code)
		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const res = exception.getResponse();

			if (typeof res === "object" && res !== null && "message" in res) {
				const typedRes = res as HttpExceptionResponse;
				message = Array.isArray(typedRes.message)
					? typedRes.message[0]
					: typedRes.message;
			} else {
				message = exception.message;
			}

			this.logger.warn({
				requestId,
				status,
				message: exception.message,
				path: request.url,
				method: request.method,
				userId: request.user?.Id ?? null,
				body: this.sanitizeBody(request.body as Record<string, unknown>),
			});
		}

		// TypeORM errors
		else if (exception instanceof QueryFailedError) {
			const pg = exception as PostgresQueryError;

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
				detail: pg.detail,
				query: pg.query,
				path: request.url,
				method: request.method,
				userId: request.user?.Id ?? null,
			});
		} else if (exception instanceof EntityNotFoundError) {
			status = HttpStatus.NOT_FOUND;
			message = "The requested record was not found.";

			this.logger.warn({
				requestId,
				type: "EntityNotFoundError",
				path: request.url,
				method: request.method,
				userId: request.user?.Id ?? null,
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
				path: request.url,
				method: request.method,
				userId: request.user?.Id ?? null,
				body: this.sanitizeBody(request.body as Record<string, unknown>),
			});
		}

		response.status(status).json({
			success: false,
			requestId,
			statusCode: status,
			message,
			timestamp: new Date().toISOString(),
			path: request.url,
		});
	}

	private sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
		if (!body) return {};
		const SENSITIVE = new Set([
			"password",
			"passwordHash",
			"tempPassword",
			"currentPassword",
			"newPassword",
		]);
		return Object.fromEntries(
			Object.entries(body).filter(([key]) => !SENSITIVE.has(key)),
		);
	}
}
