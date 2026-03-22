import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAccount } from "../Models/13.UserAccountEntity";
import { Staff } from "../Models/7.StaffEntity";
import { UserAccountController } from "./8.UserAccountController";
import { UserAccountService } from "./8.UserAccountService";

@Module({
	imports: [TypeOrmModule.forFeature([UserAccount, Staff])],
	controllers: [UserAccountController],
	providers: [UserAccountService],
	exports: [UserAccountService],
})
export class UserAccountModule {}
