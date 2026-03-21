import { Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CurrentUserAccount } from "../Auth/Decorators/CurrentUserAccountDecorator";
import { UserAccountDto } from "../Models/13.UserAccountDto";
import { CreateGradeLevelDto, UpdateGradeLevelDto } from "../Models/4.GradeLevelDto";
import { GradeLevelService } from "./4.GradeLevelService";

@Controller("grade-levels")
export class GradeLevelController {
	constructor(private readonly gradeLevelService: GradeLevelService) { }
	@Get("all")
	findAll(@CurrentUserAccount() account: UserAccountDto) {
		if (!account.SchoolId) throw new Error('User does not belong to a school');
		return this.gradeLevelService.findAll(account.SchoolId);
	}

	@Get("one/:id")
	findOne(@Param('id') id: string) {
		return this.gradeLevelService.findOne(id);
	}

	@Post("create")
	create(createGradeLevelDto: CreateGradeLevelDto) {
		return this.gradeLevelService.create(createGradeLevelDto);
	}

	@Put("update/:id")
	update(@Param('id') id: string, updateGradeLevelDto: UpdateGradeLevelDto) {
		return this.gradeLevelService.update(id, updateGradeLevelDto);
	}

	@Delete("remove/:id")
	remove(@Param('id') id: string) {
		return this.gradeLevelService.remove(id);
	}
}
