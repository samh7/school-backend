import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../models/school.entity";
import { Student } from "../models/student.entity";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";

@Module({
	imports: [TypeOrmModule.forFeature([Student, School])],
	controllers: [StudentController],
	providers: [StudentService],
	exports: [StudentService],
})
export class StudentModule {}
