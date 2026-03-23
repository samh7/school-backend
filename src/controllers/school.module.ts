import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../models/school.entity";
import { SchoolController } from "./school.controller";
import { SchoolService } from "./school.service";
import { StaffModule } from "./staff.module";
import { UserAccountModule } from "./user-account.module";

@Module({
	imports: [StaffModule, UserAccountModule, TypeOrmModule.forFeature([School])],
	controllers: [SchoolController],
	providers: [SchoolService],
	exports: [SchoolService],
})
export class SchoolModule {}
