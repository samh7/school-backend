import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../Models/1.SchoolEntity";
import { Student } from "../Models/11.StudentEntity";
import { StudentController } from "./9.StudentController";
import { StudentService } from "./9.StudentService";

@Module({
	imports: [TypeOrmModule.forFeature([Student, School])],
	controllers: [StudentController],
	providers: [StudentService],
	exports: [StudentService]

})
export class StudentModule { }
