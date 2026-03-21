import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Student } from "../Models/11.StudentEntity";
import { StudentEnrollment } from "../Models/12.StudentEnrollmentEntity";
import { AcademicYear } from "../Models/2.AcademicYearEntity";
import { Term } from "../Models/3.TermEntity";
import { Stream } from "../Models/5.StreamEntity";
import { StudentEnrollmentController } from "./10.StudentEnrollmentController";
import { StudentEnrollmentService } from "./10.StudentEnrollmentService";

@Module({
	imports: [TypeOrmModule.forFeature([
		StudentEnrollment, Student, Stream, AcademicYear, Term
	])],
	controllers: [StudentEnrollmentController],
	providers: [StudentEnrollmentService],
	exports: [StudentEnrollmentService]

})
export class StudentEnrollmentModule { }
