import { Module } from "@nestjs/common";
import { UserAccountController } from "./8.UserAccountController";

@Module({
	imports: [],
	controllers: [UserAccountController],
	providers: []
})
export class UserAccountModule { }
