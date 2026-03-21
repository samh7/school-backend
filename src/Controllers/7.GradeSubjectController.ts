import { Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateGradeSubjectDto, UpdateGradeSubjectDto } from "../Models/8.GradeSubjectDto";
import { GradeSubjectService } from "./7.GradeSubjectService";

@Controller("grade-subjects")
export class GradeSubjectController {
	constructor(private readonly gradeSubjectService: GradeSubjectService) { }
	@Get("all/:id")
	findAll(@Param("id") id: string) {
		return this.gradeSubjectService.findAll(id);
	}

	@Get("one/:id")
	findOne(@Param("id") id: string) {
		return this.gradeSubjectService.findOne(id);
	}

	@Post("create")
	create(createGradeSubjectDto: CreateGradeSubjectDto) {
		return this.gradeSubjectService.create(createGradeSubjectDto);
	}

	@Put("update/:id")
	update(@Param("id") id: string, updateGradeSubjectDto: UpdateGradeSubjectDto) {
		return this.gradeSubjectService.update(id, updateGradeSubjectDto);
	}

	@Delete("remove/:id")
	remove(@Param("id") id: string) {
		return this.gradeSubjectService.remove(id);
	}

}
