import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../Models/1.SchoolEntity";
import { GradeLevel } from "../Models/4.GradeLevelEntity";
import { Subject } from "../Models/6.SubjectEntity";
import { GradeSubject } from "../Models/8.GradeSubjectEntity";
import { GradeSubjectController } from "./7.GradeSubjectController";
import { GradeSubjectService } from "./7.GradeSubjectService";

@Module({
	imports: [
		TypeOrmModule.forFeature([GradeSubject, GradeLevel, Subject, School]),
	],
	controllers: [GradeSubjectController],
	providers: [GradeSubjectService],
	exports: [GradeSubjectService],
})
export class GradeSubjectModule {}
