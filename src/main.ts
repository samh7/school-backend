import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { writeFileSync } from "fs";
import { AppModule } from "./AppModule";
import { GlobalExceptionFilter } from "./Common/GlobalExceptionFilter";
import { ResponseInterceptor } from "./Common/ResponseInterceptor";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.set("trust proxy", 1);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	app.useGlobalFilters(new GlobalExceptionFilter());
	app.useGlobalInterceptors(new ResponseInterceptor());

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
	if (process.env.NODE_ENV === "development") {
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
