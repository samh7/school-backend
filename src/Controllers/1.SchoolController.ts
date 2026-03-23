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
import {
	CreateWithSchoolAdminAccountDto,
	UpdateSchoolDto,
} from "../Models/1.SchoolDto";
import { RoleEnum } from "../Models/Types/RoleEnum";
import { SchoolService } from "./1.SchoolService";
import { StaffService } from "./11.StaffService";
import { UserAccountService } from "./8.UserAccountService";

@Roles(RoleEnum.SYSTEM_ADMIN)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("schools")
export class SchoolController {
	constructor(
		private readonly schoolService: SchoolService,
		private readonly userAccountService: UserAccountService,
		private readonly staffService: StaffService,
	) {}

	@Get("all")
	findAll() {
		return this.schoolService.findAll();
	}
	@Get("one/:id")
	findOne(@Param("id") id: string) {
		return this.schoolService.findOne(id);
	}
	@Post("create")
	async createWithSchoolAdminAccount(
		@Body() createWithSchoolAdminAccountDto: CreateWithSchoolAdminAccountDto,
	) {
		const { createSchoolDto, createStaffDto } = createWithSchoolAdminAccountDto;
		const school = await this.schoolService.create(createSchoolDto);
		const staff = await this.staffService.create({
			...createStaffDto,
			schoolId: school.id,
		});
		return {
			school,
			staff,
		};
	}
	@Put("update/:id")
	update(@Param("id") id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
		return this.schoolService.update(id, updateSchoolDto);
	}
	@Delete("remove/:id")
	remove(@Param("id") id: string) {
		return this.schoolService.remove(id);
	}
}
