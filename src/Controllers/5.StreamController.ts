import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateStreamDto, UpdateStreamDto } from "../Models/5.StreamDto";
import { StreamService } from "./5.StreamService";

@Controller("streams")
export class StreamController {
	constructor(private readonly streamService: StreamService) { }
	@Get("all/:id")
	findAll(@Param("id") id: string) {
		return this.streamService.findAll(id);
	}

	@Get("one/:id")
	findOne(@Param("id") id: string) {
		return this.streamService.findOne(id);
	}

	@Get("enrollments/:streamId/:termId")
	countEnrollments(@Param("streamId") streamId: string, @Param("termId") termId: string) {
		return this.streamService.countEnrollments(streamId, termId);
	}

	@Post("create")
	create(@Body() createStreamDto: CreateStreamDto) {
		return this.streamService.create(createStreamDto);
	}

	@Put("update/:id")
	update(@Param("id") id: string, @Body() updateStreamDto: UpdateStreamDto) {
		return this.streamService.update(id, updateStreamDto);
	}

	@Delete("remove/:id")
	remove(@Param("id") id: string) {
		return this.streamService.remove(id);
	}
}
