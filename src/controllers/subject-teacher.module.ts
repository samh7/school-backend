import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubjectTeacher } from "../models/subject-teacher.entity";
import { SubjectTeacherController } from "./subject-teacher.controller";
import { SubjectTeacherService } from "./subject-teacher.service";

@Module({
	imports: [TypeOrmModule.forFeature([SubjectTeacher])],
	controllers: [SubjectTeacherController],
	providers: [SubjectTeacherService],
	exports: [SubjectTeacherService],
})
export class SubjectTeacherModule {}
