import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "../auth/decorators/role.decorator";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { RoleEnum } from "../models/types/role-enum";
import { ClassTeacherService } from "./class-teacher.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
