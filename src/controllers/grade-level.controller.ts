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
import {
	CreateGradeLevelDto,
	UpdateGradeLevelDto,
} from "../models/grade-level.dto";
import { RoleEnum } from "../models/types/role-enum";
import { GradeLevelService } from "./grade-level.service";

@Roles(RoleEnum.SCHOOL_ADMIN)
@Controller("grade-levels")
export class GradeLevelController {
	constructor(private readonly gradeLevelService: GradeLevelService) {}
	@Get("all/:id")
	findAll(@Param("id") id: string) {
		return this.gradeLevelService.findAll(id);
	}

	@Get("one/:id")
	findOne(@Param("id") id: string) {
		return this.gradeLevelService.findOne(id);
	}

	@Post("create")
	create(@Body() createGradeLevelDto: CreateGradeLevelDto) {
		return this.gradeLevelService.create(createGradeLevelDto);
	}

	@Put("update/:id")
	update(
		@Param("id") id: string,
		@Body() updateGradeLevelDto: UpdateGradeLevelDto,
	) {
		return this.gradeLevelService.update(id, updateGradeLevelDto);
	}

	@Delete("remove/:id")
	remove(@Param("id") id: string) {
		return this.gradeLevelService.remove(id);
	}
}
