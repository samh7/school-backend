import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
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
		JwtModule,
		ConfigModule,
		UserAccountModule

	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, UserAccountService],
})
export class AuthModule { }
