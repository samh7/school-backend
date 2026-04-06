import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenBlocklistService } from "../common/token-blocklist.service";
import { EnvVariables } from "../config/env-types";
import { UserAccountModule } from "../controllers/user-account.module";
import { Staff } from "../models/staff.entity";
import { UserAccount } from "../models/user-account.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
	imports: [
		TypeOrmModule.forFeature([UserAccount, Staff]),
		ConfigModule,
		UserAccountModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService<EnvVariables, true>) => {
				const secret = configService.get<string>("JWT_ACCESS_TOKEN_SECRET");
				return {
					global: true,
					secret: secret,
					signOptions: {
						expiresIn: configService.get("JWT_EXPIRES_IN"),
					},
				};
			},
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, TokenBlocklistService],
	exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
