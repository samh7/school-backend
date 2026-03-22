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
import { Roles } from "../Auth/Decorators/RoleDecorator";
import { JwtAuthGuard } from "../Auth/JwtGuard";
import { CreateSubjectDto, UpdateSubjectDto } from "../Models/6.SubjectDto";
import { RoleEnum } from "../Models/Types/RoleEnum";
import { SubjectService } from "./6.SubjectService";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
