import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../models/school.entity";
import { GradeLevel } from "../models/grade-level.entity";
import { Subject } from "../models/subject.entity";
import { GradeSubject } from "../models/grade-subject.entity";
import { GradeSubjectController } from "./grade-subject.controller";
import { GradeSubjectService } from "./grade-subject.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([GradeSubject, GradeLevel, Subject, School]),
	],
	controllers: [GradeSubjectController],
	providers: [GradeSubjectService],
	exports: [GradeSubjectService],
})
export class GradeSubjectModule {}
