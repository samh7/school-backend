import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import compression from "compression";
import * as express from "express";
import { writeFileSync } from "fs";
import helmet from "helmet";
import hpp from "hpp";
import { AppModule } from "./AppModule";
import { GlobalExceptionFilter } from "./Common/GlobalExceptionFilter";
import { ResponseInterceptor } from "./Common/ResponseInterceptor";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	if (!process.env.FRONTEND_URL) throw new Error("FRONTEND_URL is required");
	app.use(
		helmet({
			contentSecurityPolicy:
				process.env.NODE_ENV === "development"
					? false
					: {
							directives: {
								defaultSrc: ["'self'"],
								scriptSrc: ["'self'"],
								styleSrc: ["'self'", "'unsafe-inline'"],
								imgSrc: ["'self'", "data:"],
								connectSrc: ["'self'", process.env.FRONTEND_URL],
							},
						},
		}),
	);

	app.set("trust proxy", 1);

	app.enableCors({
		origin: [process.env.FRONTEND_URL],
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
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

	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
	app.useGlobalFilters(new GlobalExceptionFilter());
	app.useGlobalInterceptors(new ResponseInterceptor());

	if (process.env.NODE_ENV === "development") {
		const config = new DocumentBuilder()
			.setTitle("School Backend API")
			.setDescription("The API documentation for a School Backend Api App")
			.setVersion("1.0")
			.addBearerAuth()
			.build();

		const document = SwaggerModule.createDocument(app, config);

		SwaggerModule.setup("swagger", app, document, {
			swaggerOptions: {
				persistAuthorization: true,
			},
		});
		const swaggerJsonPath = "./swagger-spec.json";
		writeFileSync(swaggerJsonPath, JSON.stringify(document));
		console.log(`Swagger JSON generated at: ${swaggerJsonPath}`);
	}

	await app.listen(process.env.PORT ?? 3000);
	if (process.env.NODE_ENV === "development") {
		console.log("App started on \x1b[36mhttp://localhost:3000\x1b[0m");
		console.log("Swagger docs on \x1b[36mhttp://localhost:3000/swagger\x1b[0m");
	}
}
void bootstrap();
