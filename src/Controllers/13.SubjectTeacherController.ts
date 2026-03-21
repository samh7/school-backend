import { Controller, Get, Param } from "@nestjs/common";
import { SubjectTeacherService } from "./13.SubjectTeacherService";

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
