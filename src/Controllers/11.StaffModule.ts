import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../Models/1.SchoolEntity";
import { ClassTeacher } from "../Models/10.ClassTeacherEntity";
import { UserAccount } from "../Models/13.UserAccountEntity";
import { AcademicYear } from "../Models/2.AcademicYearEntity";
import { Stream } from "../Models/5.StreamEntity";
import { Staff } from "../Models/7.StaffEntity";
import { GradeSubject } from "../Models/8.GradeSubjectEntity";
import { SubjectTeacher } from "../Models/9.SubjectTeacherEntity";
import { StaffController } from "./11.StaffController";
import { StaffService } from "./11.StaffService";

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
