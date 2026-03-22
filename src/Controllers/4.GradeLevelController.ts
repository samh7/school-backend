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
import {
	CreateGradeLevelDto,
	UpdateGradeLevelDto,
} from "../Models/4.GradeLevelDto";
import { RoleEnum } from "../Models/Types/RoleEnum";
import { GradeLevelService } from "./4.GradeLevelService";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.SCHOOL_ADMIN)
@Controller("grade-levels")
export class GradeLevelController {
	constructor(private readonly gradeLevelService: GradeLevelService) {}
	@Get("all")
	findAll(@CurrentUserAccount() account: UserAccountDto) {
		if (!account.SchoolId) throw new Error("User does not belong to a school");
		return this.gradeLevelService.findAll(account.SchoolId);
	}

	@Get("one/:id")
	findOne(@Param("id") id: string) {
		return this.gradeLevelService.findOne(id);
	}

	@Post("create")
	create(@Body() createGradeLevelDto: CreateGradeLevelDto) {
		return this.gradeLevelService.create(createGradeLevelDto);
	}

	@Put("update/:id")
	update(
		@Param("id") id: string,
		@Body() updateGradeLevelDto: UpdateGradeLevelDto,
	) {
		return this.gradeLevelService.update(id, updateGradeLevelDto);
	}

	@Delete("remove/:id")
	remove(@Param("id") id: string) {
		return this.gradeLevelService.remove(id);
	}
}
