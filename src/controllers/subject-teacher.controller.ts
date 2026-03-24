import { Controller, Get, Param } from "@nestjs/common";
import { Roles } from "../auth/decorators/role.decorator";
import { RoleEnum } from "../models/types/role-enum";
import { SubjectTeacherService } from "./subject-teacher.service";

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
