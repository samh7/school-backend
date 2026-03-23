import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "../auth/decorators/role.decorator";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { RoleEnum } from "../models/types/role-enum";
import { SubjectTeacherService } from "./subject-teacher.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.SCHOOL_ADMIN)
@Controller("subject-teachers")
export class SubjectTeacherController {
	constructor(private readonly subjectTeacherService: SubjectTeacherService) {}

	@Get("all/:id")
	findAll(@Param("id") id: string) {
		return this.subjectTeacherService.findAll(id);
	}

	@Get("one/:id")
	findOne(@Param("id") id: string) {
		return this.subjectTeacherService.findOne(id);
	}

	@Get("grade-subject/:id")
	findByGradeSubject(@Param("id") id: string) {
		return this.subjectTeacherService.findByGradeSubject(id);
	}
}
