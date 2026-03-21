import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CurrentUserAccount } from "../Auth/Decorators/CurrentUserAccountDecorator";
import { UserAccountDto } from "../Models/13.UserAccountDto";
import { CreateTermDto } from "../Models/3.TermDto";
import { TermService } from "./3.TermService";

@Controller("terms")
export class TermController {
	constructor(private readonly termService: TermService) { }
	@Get("all/:academicYearId")
	findAll(@Param('academicYearId') academicYearId: string) {
		return this.termService.findAll(academicYearId);
	}

	@Get("one/:id")
	findOne(@Param('id') id: string) {
		return this.termService.findOne(id);
	}

	@Get("current")
	findCurrent(@CurrentUserAccount() account: UserAccountDto) {
		if (!account.SchoolId) throw new Error('User account is missing SchoolId');
		return this.termService.findCurrent(account.SchoolId);
	}
	@Post("create")
	create(@CurrentUserAccount() account: UserAccountDto, @Body() dto: CreateTermDto) {
		if (!account.SchoolId) throw new Error('User account is missing SchoolId');
		return this.termService.create(account.SchoolId, dto);
	}

	@Put("update/:id")
	update(@Param('id') id: string, @Body() dto: CreateTermDto) {
		return this.termService.update(id, dto);
	}

	@Put("set-current/:id")
	setCurrent(@Param('id') id: string) {
		return this.termService.setCurrent(id);
	}

	@Delete("remove/:id")
	remove(@Param('id') id: string) {
		return this.termService.remove(id);
	}
}
