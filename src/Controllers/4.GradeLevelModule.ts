import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../Models/1.SchoolEntity";
import { GradeLevel } from "../Models/4.GradeLevelEntity";
import { GradeLevelController } from "./4.GradeLevelController";

@Module({
	imports: [TypeOrmModule.forFeature([GradeLevel, School])],
	controllers: [GradeLevelController],
})
export class GradeLevelModule { }
