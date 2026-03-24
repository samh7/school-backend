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
	CreateAcademicYearDto,
	UpdateAcademicYearDto,
} from "../models/academic-year.dto";
import { RoleEnum } from "../models/types/role-enum";
import { AcademicYearService } from "./academic-year.service";

@Roles(RoleEnum.SCHOOL_ADMIN)
@Controller("academic-years")
export class AcademicYearController {
	constructor(private readonly academicYearService: AcademicYearService) {}

	@Get("all/:id")
	findAll(@Param("id") id: string) {
		return this.academicYearService.findAll(id);
	}

	@Get("one/:id")
	findOne(@Param("id") id: string) {
		return this.academicYearService.findOne(id);
	}
	@Get("current/:id")
	findCurrent(@Param("id") id: string) {
		return this.academicYearService.findCurrent(id);
	}
	@Post("create")
	create(@Body() createAcademicYearDto: CreateAcademicYearDto) {
		return this.academicYearService.create(createAcademicYearDto);
	}

	@Put("update/:id")
	update(
		@Param("id") id: string,
		@Body() updateAcademicYearDto: UpdateAcademicYearDto,
	) {
		return this.academicYearService.update(id, updateAcademicYearDto);
	}
	@Put("current/:id")
	setCurrent(@Param("id") id: string) {
		return this.academicYearService.setCurrent(id);
	}
	@Delete("remove/:id")
	remove(@Param("id") id: string) {
		return this.academicYearService.remove(id);
	}
}
