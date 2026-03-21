import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { writeFileSync } from 'fs';
import { AppModule } from './AppModule';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('School Backend API')
    .setDescription('The API documentation for a School Backend Api App')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);
  writeFileSync('./swagger-spec.json', JSON.stringify(document));

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
