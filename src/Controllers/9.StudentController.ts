import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "../Auth/Decorators/RoleDecorator";
import { JwtAuthGuard } from "../Auth/JwtGuard";
import { CreateStudentDto, UpdateStudentDto } from "../Models/11.StudentDto";
import { RoleEnum } from "../Models/Types/RoleEnum";
import { StudentService } from "./9.StudentService";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.SCHOOL_ADMIN)
@Controller("students")
export class StudentController {
	constructor(private readonly studentService: StudentService) { }

	@Get("all/:id")
	findAll(@Param("id") id: string) {
		return this.studentService.findAll(id);
	}

	@Get("one/:id")
	findOne(@Param("id") id: string) {
		return this.studentService.findOne(id);
	}
	@Get("admission/:admissionNumber")
	findByAdmissionNumber(@Param("admissionNumber") admissionNumber: string) {
		return this.studentService.findByAdmissionNumber(admissionNumber);
	}

	@Get("stream/:streamId/term/:termId")
	findByStream(@Param("streamId") streamId: string, @Param("termId") termId: string) {
		return this.studentService.findByStream(streamId, termId);
	}

	@Post("create")
	create(@Body() createStudentDto: CreateStudentDto) {
		return this.studentService.create(createStudentDto);
	}

	@Put("update/:id")
	update(@Param("id") id: string, @Body() updateStudentDto: UpdateStudentDto) {
		return this.studentService.update(id, updateStudentDto);
	}

	@Delete("delete/:id")
	remove(@Param("id") id: string) {
		return this.studentService.remove(id);
	}

}
