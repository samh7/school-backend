import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubjectTeacher } from "../Models/9.SubjectTeacherEntity";
import { SubjectTeacherController } from "./13.SubjectTeacherController";
import { SubjectTeacherService } from "./13.SubjectTeacherService";

@Module({
	imports: [TypeOrmModule.forFeature([SubjectTeacher])],
	controllers: [SubjectTeacherController],
	providers: [SubjectTeacherService],
	exports: [SubjectTeacherService]
})
export class SubjectTeacherModule { }
