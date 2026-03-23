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
import { Roles } from "../Auth/Decorators/RoleDecorator";
import { JwtAuthGuard } from "../Auth/JwtGuard";
import {
	AssignSubjectDto,
	BulkAssignSubjectsDto,
} from "../Models/14.StudentSubjectAssignmentDto";
import { RoleEnum } from "../Models/Types/RoleEnum";
import { StudentSubjectAssignmentService } from "./14.StudentSubjectAssignmentService";

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
