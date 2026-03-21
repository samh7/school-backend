import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AssignClassTeacherDto, AssignSubjectTeacherDto, CreateStaffDto, UpdateStaffDto } from "../Models/7.StaffDto";
import { StaffService } from "./11.StaffService";

@Controller()
export class StaffController {
	constructor(private readonly staffService: StaffService) { }
	@Get("all/:id")
	findAll(@Param("id") id: string) {
		return this.staffService.findAll(id);
	}

	@Get("one/:id")
	findOne(@Param("id") id: string) {
		return this.staffService.findOne(id);
	}

	@Get("role/:schoolId/:role")
	findByRole(@Param("schoolId") schoolId: string, @Param("role") role: string) {
		return this.staffService.findByRole(schoolId, role);
	}

	@Post("create")
	create(@Body() createStaffDto: CreateStaffDto) {
		return this.staffService.create(createStaffDto);
	}

	@Put("update/:id")
	update(@Param("id") id: string, @Body() dto: UpdateStaffDto) {
		return this.staffService.update(id, dto);
	}

	@Delete("deactivate/:id")
	deactivate(@Param("id") id: string) {
		return this.staffService.deactivate(id);
	}

	@Post("assign-class-teacher")
	assignClassTeacher(@Body() assignClassTeacherDto: AssignClassTeacherDto) {
		return this.staffService.assignClassTeacher(assignClassTeacherDto);
	}

	@Delete("remove-class-teacher/:id")
	removeClassTeacher(@Param("id") id: string) {
		return this.staffService.removeClassTeacher(id);
	}

	@Post("assign-subject-teacher")
	assignSubjectTeacher(@Body() assignSubjectTeacherDto: AssignSubjectTeacherDto) {
		return this.staffService.assignSubjectTeacher(assignSubjectTeacherDto);
	}

	@Delete("remove-subject-teacher/:id")
	removeSubjectTeacher(@Param("id") id: string) {
		return this.staffService.removeSubjectTeacher(id);
	}

}
