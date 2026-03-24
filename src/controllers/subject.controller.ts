import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from "@nestjs/common";
import { Roles } from "../auth/decorators/role.decorator";
import { CreateSubjectDto, UpdateSubjectDto } from "../models/subject.dto";
import { RoleEnum } from "../models/types/role-enum";
import { SubjectService } from "./subject.service";

@Roles(RoleEnum.SCHOOL_ADMIN)
@Controller("subjects")
export class SubjectController {
	constructor(private readonly subjectService: SubjectService) {}

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
