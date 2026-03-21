import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { CurrentUserAccount } from "../Auth/Decorators/CurrentUserAccountDecorator";
import { Roles } from "../Auth/Decorators/RoleDecorator";
import { CreateSchoolDto } from "../Models/1.SchoolDto";
import { UserAccountDto } from "../Models/13.UserAccountDto";
import { CreateStaffDto } from "../Models/7.StaffDto";
import { RoleEnum } from "../Models/Types/RoleEnum";
import { SchoolService } from "./1.SchoolService";
import { StaffService } from "./11.StaffService";
import { UserAccountService } from "./8.UserAccountService";

@Roles(RoleEnum.SYSTEM_ADMIN)
@Controller("schools")
export class SchoolController {
	constructor(
		private readonly schoolService: SchoolService,
		private readonly userAccountService: UserAccountService,
		private readonly staffService: StaffService,
	) { }

	@Get("all")
	findAll(@CurrentUserAccount() account: UserAccountDto) {
		return this.schoolService.findAll();
	}
	@Get("one/:id")
	findOne(@Param('id') id: string, schoolId: string) {

		return this.schoolService.findOne(schoolId);
	}
	@Post("create")
	async createWithSchoolAdminAccount(@Body() createSchoolDto: CreateSchoolDto, createStaffDto: CreateStaffDto) {

		const school = await this.schoolService.create(createSchoolDto);
		const staff = await this.staffService.create(createStaffDto);
		const userAccount = await this.userAccountService.CreateForStaff(staff.Id, createStaffDto.Role);

		return { ...plainToInstance(UserAccountDto, userAccount), school, staff };
	}
	@Put("update/:id")
	update(@Param('id') id: string, @Body() updateSchoolDto: CreateSchoolDto) {

		return this.schoolService.update(id, updateSchoolDto);
	}
	@Delete("remove/:id")
	remove(@Param('id') id: string) {
		return this.schoolService.remove(id);
	}
}
