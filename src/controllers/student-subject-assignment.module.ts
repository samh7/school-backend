import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Student } from "../models/student.entity";
import { StudentEnrollment } from "../models/student-enrollment.entity";
import { StudentSubjectAssignment } from "../models/student-subject-assignment.entity";
import { GradeSubject } from "../models/grade-subject.entity";
import { StudentSubjectAssignmentController } from "./student-subject-assignment.controller";
import { StudentSubjectAssignmentService } from "./student-subject-assignment.service";

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
