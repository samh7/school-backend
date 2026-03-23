import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../models/school.entity";
import { ClassTeacher } from "../models/class-teacher.entity";
import { UserAccount } from "../models/user-account.entity";
import { AcademicYear } from "../models/academic-year.entity";
import { Stream } from "../models/stream.entity";
import { Staff } from "../models/staff.entity";
import { GradeSubject } from "../models/grade-subject.entity";
import { SubjectTeacher } from "../models/subject-teacher.entity";
import { StaffController } from "./staff.controller";
import { StaffService } from "./staff.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Staff,
			School,
			UserAccount,
			ClassTeacher,
			SubjectTeacher,
			Stream,
			GradeSubject,
			AcademicYear,
		]),
	],
	controllers: [StaffController],
	providers: [StaffService],
	exports: [StaffService],
})
export class StaffModule {}
