import { Controller, Get, Param } from "@nestjs/common";
import { Roles } from "../auth/decorators/role.decorator";
import { RoleEnum } from "../models/types/role-enum";
import { ClassTeacherService } from "./class-teacher.service";

@Roles(RoleEnum.SCHOOL_ADMIN)
@Controller("class-teachers")
export class ClassTeacherController {
	constructor(private readonly classTeacherService: ClassTeacherService) {}

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
