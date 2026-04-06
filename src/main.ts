import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import compression from "compression";
import { createHash } from "crypto";
import * as express from "express";
import { existsSync, readFileSync } from "fs";
import { writeFile } from "fs/promises";
import helmet from "helmet";
import hpp from "hpp";
import { join } from "path";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/global-exception.filter";
import { ResponseInterceptor } from "./common/response.interceptor";
async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	const frontendUrl = process.env.FRONTEND_URL;
	if (!process.env.FRONTEND_URL) throw new Error("FRONTEND_URL is required");
	if (!frontendUrl) throw new Error("FRONTEND_URL is required");
	try {
		const parsed = new URL(frontendUrl);
		if (!["https:", "http:"].includes(parsed.protocol)) {
			throw new Error("FRONTEND_URL must use http or https protocol");
		}
	} catch {
		throw new Error(`FRONTEND_URL is not a valid URL: "${frontendUrl}"`);
	}
	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					defaultSrc: ["'self'"],
					scriptSrc: ["'self'"],
					styleSrc: ["'self'", "'unsafe-inline'"],
					imgSrc: ["'self'", "data:"],
					connectSrc: ["'self'", frontendUrl],
				},
				// In dev: report violations but don't block. In prod: enforce hard.
				reportOnly: process.env.NODE_ENV === "development",
			},
		}),
	);

	// Trust exactly one reverse-proxy hop (e.g. nginx in front of this app).
	// If you add Cloudflare or another proxy layer, increment this to 2.
	app.set("trust proxy", 1);

	app.enableCors({
		origin: [process.env.FRONTEND_URL],
		allowedHeaders: ["Content-Type", "Authorization"],
		// This is done by design since we're using bearer tokens
		credentials: false,
	});

	app.use(express.json({ limit: "10kb" }));
	app.use(express.urlencoded({ extended: false, limit: "10kb" }));

	app.use(hpp());
	app.use(compression());

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			forbidUnknownValues: true,
		}),
	);

	app.useGlobalInterceptors(
		new ResponseInterceptor(),
		new ClassSerializerInterceptor(app.get(Reflector)),
	);
	app.useGlobalFilters(new GlobalExceptionFilter());

	if (process.env.NODE_ENV === "development") {
		const config = new DocumentBuilder()
			.setTitle("School Backend API")
			.setDescription("The API documentation for a School Backend Api App")
			.setVersion("1.0")
			.addBearerAuth()
			.addSecurityRequirements("bearer")
			.build();

		const document = SwaggerModule.createDocument(app, config);

		SwaggerModule.setup("swagger", app, document, {
			swaggerOptions: {
				persistAuthorization: true,
			},
		});
		const swaggerJsonPath = join(process.cwd(), "swagger-spec.json");
		const newSpec = JSON.stringify(document);
		const newHash = createHash("sha256").update(newSpec).digest("hex");
		const oldHash = existsSync(swaggerJsonPath)
			? createHash("sha256")
					.update(readFileSync(swaggerJsonPath, "utf8"))
					.digest("hex")
			: null;

		// Only write to the file when there are changes
		if (newHash !== oldHash) {
			void writeFile(swaggerJsonPath, newSpec);
			console.log(`Swagger JSON updated at: ${swaggerJsonPath}`);
		}
	}
	await app.listen(process.env.PORT ?? 3000);
	if (process.env.NODE_ENV === "development") {
		console.log(
			`App started on \x1b[36mhttp://localhost:${process.env.PORT}\x1b[0m`,
		);
		console.log(
			`Swagger docs on \x1b[36mhttp://localhost:${process.env.PORT}/swagger\x1b[0m`,
		);
	}
}
void bootstrap();
