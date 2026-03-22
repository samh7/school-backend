import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../Models/1.SchoolEntity";
import { GradeLevel } from "../Models/4.GradeLevelEntity";
import { GradeLevelController } from "./4.GradeLevelController";
import { GradeLevelService } from "./4.GradeLevelService";

@Module({
	imports: [TypeOrmModule.forFeature([GradeLevel, School])],
	controllers: [GradeLevelController],
	providers: [GradeLevelService],
	exports: [GradeLevelService],
})
export class GradeLevelModule {}
