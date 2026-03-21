import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateSubjectDto, UpdateSubjectDto } from "../Models/6.SubjectDto";
import { SubjectService } from "./6.SubjectService";

@Controller("subjects")
export class SubjectController {
	constructor(
		private readonly subjectService: SubjectService
	) { }

	@Get("all/:id")
	findAll(@Param("id") id: string) {
		return this.subjectService.findAll(id);
	}

	@Get("one/:id")
	findOne(@Param("id") id: string) {
		return this.subjectService.findOne(id);
	}

	@Post("create")
	create(@Body() createSubjectDto: CreateSubjectDto) {
		return this.subjectService.create(createSubjectDto);
	}

	@Put("update/:id")
	update(@Param("id") id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
		return this.subjectService.update(id, updateSubjectDto);
	}

	@Delete("remove/:id")
	remove(@Param("id") id: string) {
		return this.subjectService.remove(id);
	}

}
