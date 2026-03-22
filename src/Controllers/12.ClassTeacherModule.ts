import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassTeacher } from "../Models/10.ClassTeacherEntity";
import { ClassTeacherController } from "./12.ClassTeacherController";
import { ClassTeacherService } from "./12.ClassTeacherService";

@Module({
	imports: [TypeOrmModule.forFeature([ClassTeacher])],
	controllers: [ClassTeacherController],
	providers: [ClassTeacherService],
	exports: [ClassTeacherService],
})
export class ClassTeacherModule {}
