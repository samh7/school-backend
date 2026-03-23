import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassTeacher } from "../models/class-teacher.entity";
import { ClassTeacherController } from "./class-teacher.controller";
import { ClassTeacherService } from "./class-teacher.service";

@Module({
	imports: [TypeOrmModule.forFeature([ClassTeacher])],
	controllers: [ClassTeacherController],
	providers: [ClassTeacherService],
	exports: [ClassTeacherService],
})
export class ClassTeacherModule {}
