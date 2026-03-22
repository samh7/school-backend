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
import { CurrentUserAccount } from "../Auth/Decorators/CurrentUserAccountDecorator";
import { Roles } from "../Auth/Decorators/RoleDecorator";
import { JwtAuthGuard } from "../Auth/JwtGuard";
import { UserAccountDto } from "../Models/13.UserAccountDto";
import { CreateTermDto } from "../Models/3.TermDto";
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

	@Get("current")
	findCurrent(@CurrentUserAccount() account: UserAccountDto) {
		if (!account.SchoolId) throw new Error("User account is missing SchoolId");
		return this.termService.findCurrent(account.SchoolId);
	}
	@Post("create")
	create(
		@CurrentUserAccount() account: UserAccountDto,
		@Body() dto: CreateTermDto,
	) {
		if (!account.SchoolId) throw new Error("User account is missing SchoolId");
		return this.termService.create(account.SchoolId, dto);
	}

	@Put("update/:id")
	update(@Param("id") id: string, @Body() dto: CreateTermDto) {
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
