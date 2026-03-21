import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAccount } from "../Models/13.UserAccountEntity";
import { AuthController } from "./AuthController";

@Module({
	imports: [
		TypeOrmModule.forFeature([UserAccount, UserAccount]),
	],
	controllers: [AuthController],
	providers: [],
})
export class AuthModule { }
