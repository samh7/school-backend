import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Student } from "../models/student.entity";
import { StudentEnrollment } from "../models/student-enrollment.entity";
import { AcademicYear } from "../models/academic-year.entity";
import { Term } from "../models/term.entity";
import { Stream } from "../models/stream.entity";
import { StudentEnrollmentController } from "./student-enrollment.controller";
import { StudentEnrollmentService } from "./student-enrollment.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			StudentEnrollment,
			Student,
			Stream,
			AcademicYear,
			Term,
		]),
	],
	controllers: [StudentEnrollmentController],
	providers: [StudentEnrollmentService],
	exports: [StudentEnrollmentService],
})
export class StudentEnrollmentModule {}
