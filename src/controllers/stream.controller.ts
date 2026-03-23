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
import { CreateStreamDto, UpdateStreamDto } from "../models/stream.dto";
import { RoleEnum } from "../models/types/role-enum";
import { StreamService } from "./stream.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.SCHOOL_ADMIN)
@Controller("streams")
export class StreamController {
	constructor(private readonly streamService: StreamService) {}
	@Get("all/:id")
	findAll(@Param("id") id: string) {
		return this.streamService.findAll(id);
	}

	@Get("one/:id")
	findOne(@Param("id") id: string) {
		return this.streamService.findOne(id);
	}

	@Get("enrollments/:streamId/:termId")
	countEnrollments(
		@Param("streamId") streamId: string,
		@Param("termId") termId: string,
	) {
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
