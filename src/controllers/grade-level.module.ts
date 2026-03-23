import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../models/school.entity";
import { GradeLevel } from "../models/grade-level.entity";
import { GradeLevelController } from "./grade-level.controller";
import { GradeLevelService } from "./grade-level.service";

@Module({
	imports: [TypeOrmModule.forFeature([GradeLevel, School])],
	controllers: [GradeLevelController],
	providers: [GradeLevelService],
	exports: [GradeLevelService],
})
export class GradeLevelModule {}
