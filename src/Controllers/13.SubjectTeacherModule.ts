import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubjectTeacher } from "../Models/9.SubjectTeacherEntity";
import { SubjectTeacherController } from "./13.SubjectTeacherController";

@Module({
	imports: [TypeOrmModule.forFeature([SubjectTeacher])],
	controllers: [SubjectTeacherController]
})
export class SubjectTeacherModule { }
