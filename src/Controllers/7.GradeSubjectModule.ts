import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../Models/1.SchoolEntity";
import { GradeLevel } from "../Models/4.GradeLevelEntity";
import { Subject } from "../Models/6.SubjectEntity";
import { GradeSubject } from "../Models/8.GradeSubjectEntity";
import { GradeSubjectController } from "./7.GradeSubjectController";

@Module({
	imports: [TypeOrmModule.forFeature([GradeSubject, GradeLevel, Subject, School])],
	controllers: [GradeSubjectController]
})
export class GradeSubjectModule { }
