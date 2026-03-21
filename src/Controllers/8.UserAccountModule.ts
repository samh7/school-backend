import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAccount } from "../Models/13.UserAccountEntity";
import { Staff } from "../Models/7.StaffEntity";
import { UserAccountController } from "./8.UserAccountController";

@Module({
	imports: [TypeOrmModule.forFeature([UserAccount, Staff])],
	controllers: [UserAccountController],
	providers: []
})
export class UserAccountModule { }
