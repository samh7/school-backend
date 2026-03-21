import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "../Auth/Decorators/RoleDecorator";
import { JwtAuthGuard } from "../Auth/JwtGuard";
import { RoleEnum } from "../Models/Types/RoleEnum";
import { ClassTeacherService } from "./12.ClassTeacherService";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.SCHOOL_ADMIN)
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
