import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Student } from "../Models/11.StudentEntity";
import { StudentEnrollment } from "../Models/12.StudentEnrollmentEntity";
import { StudentSubjectAssignment } from "../Models/14.StudentSubjectAssignmentEntity";
import { GradeSubject } from "../Models/8.GradeSubjectEntity";
import { StudentSubjectAssignmentController } from "./14.StudentSubjectAssignmentController";
import { StudentSubjectAssignmentService } from "./14.StudentSubjectAssignmentService";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			StudentSubjectAssignment,
			StudentEnrollment,
			Student,
			GradeSubject,
		]),
	],
	controllers: [StudentSubjectAssignmentController],
	providers: [StudentSubjectAssignmentService],
	exports: [StudentSubjectAssignmentService],
})
export class StudentSubjectAssignmentModule {}
