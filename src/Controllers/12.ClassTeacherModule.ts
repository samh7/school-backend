import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassTeacher } from "../Models/10.ClassTeacherEntity";
import { ClassTeacherController } from "./12.ClassTeacherController";

@Module({
	imports: [TypeOrmModule.forFeature([ClassTeacher])],
	controllers: [ClassTeacherController]
})
export class ClassTeacherModule { }
