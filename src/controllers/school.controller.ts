import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from "@nestjs/common";
import { Roles } from "../auth/decorators/role.decorator";
import {
	CreateWithSchoolAdminAccountDto,
	UpdateSchoolDto,
} from "../models/school.dto";
import { RoleEnum } from "../models/types/role-enum";
import { SchoolService } from "./school.service";
import { StaffService } from "./staff.service";
import { UserAccountService } from "./user-account.service";

@Roles(RoleEnum.SYSTEM_ADMIN)
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
