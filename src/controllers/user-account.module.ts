import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAccount } from "../models/user-account.entity";
import { Staff } from "../models/staff.entity";
import { UserAccountController } from "./user-account.controller";
import { UserAccountService } from "./user-account.service";

@Module({
	imports: [TypeOrmModule.forFeature([UserAccount, Staff])],
	controllers: [UserAccountController],
	providers: [UserAccountService],
	exports: [UserAccountService],
})
export class UserAccountModule {}
