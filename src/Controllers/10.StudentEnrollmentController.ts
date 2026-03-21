import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { BulkRolloverDto, CreateEnrollmentDto, UpdateEnrollmentDto } from "../Models/12.StudentEnrollmentDto";
import { StudentEnrollmentService } from "./10.StudentEnrollmentService";

@Controller("student-enrollments")
export class StudentEnrollmentController {
	constructor(private readonly studentEnrollmentService: StudentEnrollmentService) { }
	@Get("student/:id")
	findByStudent(@Param("id") id: string) {
		return this.studentEnrollmentService.findByStudent(id);
	}

	@Get("stream/:streamId/term/:termId")
	findByStream(@Param("streamId") streamId: string, @Param("termId") termId: string) {
		return this.studentEnrollmentService.findByStream(streamId, termId);
	}

	@Get("current/student/:id")
	findCurrent(@Param("id") id: string) {
		return this.studentEnrollmentService.findCurrent(id);
	}

	@Get("one/:id")
	findOne(@Param("id") id: string) {
		return this.studentEnrollmentService.findOne(id);
	}

	@Post("enroll")
	enroll(@Body() createEnrollmentDto: CreateEnrollmentDto) {
		return this.studentEnrollmentService.enroll(createEnrollmentDto);
	}

	@Put("update/:id")
	update(@Param("id") id: string, @Body() updateEnrollmentDto: UpdateEnrollmentDto) {
		return this.studentEnrollmentService.update(id, updateEnrollmentDto);
	}

	@Post("bulk-rollover")
	bulkRollover(@Body() bulkRolloverDto: BulkRolloverDto) {
		return this.studentEnrollmentService.bulkRollover(bulkRolloverDto);
	}

	@Post("complete-term/:id")
	completeTermEnrollments(@Param("id") id: string) {
		return this.studentEnrollmentService.completeTermEnrollments(id);
	}


}
