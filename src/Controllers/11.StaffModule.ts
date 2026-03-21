import { Module } from "@nestjs/common";
import { StaffController } from "./11.StaffController";

@Module({
	imports: [],
	controllers: [StaffController],
	providers: [],
})
export class StaffModule { }
