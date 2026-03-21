import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../Models/1.SchoolEntity";
import { SchoolController } from "./1.SchoolController";
import { SchoolService } from "./1.SchoolService";
import { StaffModule } from "./11.StaffModule";
import { UserAccountModule } from "./8.UserAccountModule";

@Module({
	imports: [StaffModule, UserAccountModule, TypeOrmModule.forFeature([School])],
	controllers: [SchoolController],
	providers: [SchoolService],
	exports: [SchoolService]

})
export class SchoolModule { }
