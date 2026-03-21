import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../Models/1.SchoolEntity";
import { Student } from "../Models/11.StudentEntity";
import { StudentController } from "./9.StudentController";

@Module({
	imports: [TypeOrmModule.forFeature([Student, School])],
	controllers: [StudentController]

})
export class StudentModule { }
