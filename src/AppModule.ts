import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvironmentVariables } from "./Config/env_types";
@Module({
  imports: [
    TypeOrmModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService<EnvironmentVariables, true>) => ({
          type: 'postgres',
          url: config.getOrThrow("DATABASE_URL"),
          entities: [__dirname + '**/*Entity.{ts,js}'],
          synchronize: config.getOrThrow("NODE_ENV") !== 'production',
        })
      }
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
