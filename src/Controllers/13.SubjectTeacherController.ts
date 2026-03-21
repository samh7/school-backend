import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "../Auth/Decorators/RoleDecorator";
import { JwtAuthGuard } from "../Auth/JwtGuard";
import { RoleEnum } from "../Models/Types/RoleEnum";
import { SubjectTeacherService } from "./13.SubjectTeacherService";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.SCHOOL_ADMIN)
@Controller("subject-teachers")
export class SubjectTeacherController {
	constructor(private readonly subjectTeacherService: SubjectTeacherService) { }

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
		return;
	}

}
