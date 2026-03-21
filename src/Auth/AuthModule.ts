import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvironmentVariables } from "../Config/EnvTypes";
import { UserAccountModule } from "../Controllers/8.UserAccountModule";
import { UserAccountService } from "../Controllers/8.UserAccountService";
import { UserAccount } from "../Models/13.UserAccountEntity";
import { Staff } from "../Models/7.StaffEntity";
import { AuthController } from "./AuthController";
import { AuthService } from "./AuthService";
import { JwtStrategy } from "./JwtStrategy";

@Module({
	imports: [
		TypeOrmModule.forFeature([UserAccount, Staff]),
		ConfigModule,
		UserAccountModule,
		JwtModule.registerAsync(
			{
				imports: [ConfigModule],
				useFactory: (configService: ConfigService<EnvironmentVariables>) => {
					const secret = configService.getOrThrow("JWT_ACCESS_TOKEN_SECRET");
					return {
						global: true,
						secret: secret,
						signOptions: {
							expiresIn: configService.getOrThrow("JWT_EXPIRES_IN"),
						}
					};

				},
				inject: [ConfigService]
			}
		),

	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, UserAccountService],
	exports: [AuthService, JwtStrategy],
})
export class AuthModule {
}
