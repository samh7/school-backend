import { Module } from "@nestjs/common";
import { SchoolController } from "./1.SchoolController";
import { StaffModule } from "./11.StaffModule";
import { UserAccountModule } from "./8.UserAccountModule";

@Module({
	imports: [StaffModule, UserAccountModule],
	controllers: [SchoolController],
	providers: [],

})
export class SchoolModule { }
