import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "../auth/decorators/role.decorator";
import { JwtAuthGuard } from "../auth/jwt.guard";
import {
	AssignSubjectDto,
	BulkAssignSubjectsDto,
} from "../models/student-subject-assignment.dto";
import { RoleEnum } from "../models/types/role-enum";
import { StudentSubjectAssignmentService } from "./student-subject-assignment.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.SCHOOL_ADMIN)
@Controller("subject-assignments")
export class StudentSubjectAssignmentController {
	constructor(private readonly service: StudentSubjectAssignmentService) {}

	@Get("by-enrollment/:enrollmentId")
	findByEnrollment(@Param("enrollmentId") enrollmentId: string) {
		return this.service.findByEnrollment(enrollmentId);
	}

	@Get("by-student/:studentId")
	findByStudent(@Param("studentId") studentId: string) {
		return this.service.findByStudent(studentId);
	}

	@Post()
	assign(@Body() dto: AssignSubjectDto) {
		return this.service.assign(dto);
	}

	@Post("bulk")
	bulkAssign(@Body() dto: BulkAssignSubjectsDto) {
		return this.service.bulkAssign(dto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.service.remove(id);
	}
}
