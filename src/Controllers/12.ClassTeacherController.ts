import { Controller, Get, Param } from "@nestjs/common";
import { ClassTeacherService } from "./12.ClassTeacherService";

@Controller("class-teachers")
export class ClassTeacherController {
	constructor(private readonly classTeacherService: ClassTeacherService) { }

	@Get("all/:id")
	findAll(@Param("id") id: string) {
		return this.classTeacherService.findAll(id);
	}

	@Get("one/:id")
	findOne(@Param("id") id: string) {
		return this.classTeacherService.findOne(id);
	}

	@Get("stream/:id")
	findByStream(@Param("id") id: string) {
		return this.classTeacherService.findByStream(id);
	}

}
