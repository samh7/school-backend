import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "../auth/decorators/role.decorator";
import { JwtAuthGuard } from "../auth/jwt.guard";
import {
	CreateGradeSubjectDto,
	UpdateGradeSubjectDto,
} from "../models/grade-subject.dto";
import { RoleEnum } from "../models/types/role-enum";
import { GradeSubjectService } from "./grade-subject.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.SCHOOL_ADMIN)
@Controller("grade-subjects")
export class GradeSubjectController {
	constructor(private readonly gradeSubjectService: GradeSubjectService) {}
	@Get("all/:id")
	findAll(@Param("id") id: string) {
		return this.gradeSubjectService.findAll(id);
	}

	@Get("one/:id")
	findOne(@Param("id") id: string) {
		return this.gradeSubjectService.findOne(id);
	}

	@Post("create")
	create(@Body() createGradeSubjectDto: CreateGradeSubjectDto) {
		return this.gradeSubjectService.create(createGradeSubjectDto);
	}

	@Put("update/:id")
	update(
		@Param("id") id: string,
		@Body() updateGradeSubjectDto: UpdateGradeSubjectDto,
	) {
		return this.gradeSubjectService.update(id, updateGradeSubjectDto);
	}

	@Delete("remove/:id")
	remove(@Param("id") id: string) {
		return this.gradeSubjectService.remove(id);
	}
}
