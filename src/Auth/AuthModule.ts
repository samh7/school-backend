import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAccountService } from "../Controllers/8.UserAccountService";
import { UserAccount } from "../Models/13.UserAccountEntity";
import { AuthController } from "./AuthController";

@Module({
	imports: [
		TypeOrmModule.forFeature([UserAccount]),
	],
	controllers: [AuthController],
	providers: [UserAccountService],
})
export class AuthModule { }
