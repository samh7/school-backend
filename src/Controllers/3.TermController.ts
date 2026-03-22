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
import { CreateTermDto, UpdateTermDto } from "../Models/3.TermDto";
import { RoleEnum } from "../Models/Types/RoleEnum";
import { TermService } from "./3.TermService";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.SCHOOL_ADMIN)
@Controller("terms")
export class TermController {
	constructor(private readonly termService: TermService) {}
	@Get("all/:academicYearId")
	findAll(@Param("academicYearId") academicYearId: string) {
		return this.termService.findAll(academicYearId);
	}

	@Get("one/:id")
	findOne(@Param("id") id: string) {
		return this.termService.findOne(id);
	}

	@Get("current/:id")
	findCurrent(@Param("id") id: string) {
		return this.termService.findCurrent(id);
	}
	@Post("create/:id")
	create(@Param("id") id: string, @Body() dto: CreateTermDto) {
		return this.termService.create(id, dto);
	}

	@Put("update/:id")
	update(@Param("id") id: string, @Body() dto: UpdateTermDto) {
		return this.termService.update(id, dto);
	}

	@Post("set-current/:id")
	setCurrent(@Param("id") id: string) {
		return this.termService.setCurrent(id);
	}

	@Delete("remove/:id")
	remove(@Param("id") id: string) {
		return this.termService.remove(id);
	}
}
