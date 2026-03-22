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
	CreateAcademicYearDto,
	UpdateAcademicYearDto,
} from "../Models/2.AcademicYearDto";
import { RoleEnum } from "../Models/Types/RoleEnum";
import { AcademicYearService } from "./2.AcademicYearService";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.SCHOOL_ADMIN)
@Controller("academic-years")
export class AcademicYearController {
	constructor(private readonly academicYearService: AcademicYearService) {}

	@Get("all")
	findAll(@CurrentUserAccount() account: UserAccountDto) {
		if (!account.SchoolId)
			throw new Error("User account is not associated with a school");
		return this.academicYearService.findAll(account.SchoolId);
	}

	@Get("one/:id")
	findOne(@Param("id") id: string) {
		return this.academicYearService.findOne(id);
	}
	@Get("current")
	findCurrent(@CurrentUserAccount() account: UserAccountDto) {
		if (!account.SchoolId)
			throw new Error("User account is not associated with a school");
		return this.academicYearService.findCurrent(account.SchoolId);
	}
	@Post("create")
	create(
		@CurrentUserAccount() account: UserAccountDto,
		@Body() createAcademicYearDto: CreateAcademicYearDto,
	) {
		if (!account.SchoolId)
			throw new Error("User account is not associated with a school");
		if (createAcademicYearDto.SchoolId !== account.SchoolId)
			throw new Error("Cannot create academic year for a different school");
		return this.academicYearService.create(createAcademicYearDto);
	}

	@Put("update/:id")
	update(
		@Param("id") id: string,
		@Body() updateAcademicYearDto: UpdateAcademicYearDto,
	) {
		return this.academicYearService.update(id, updateAcademicYearDto);
	}
	@Put("current/:id")
	setCurrent(@Param("id") id: string) {
		return this.academicYearService.setCurrent(id);
	}
	@Delete("remove/:id")
	remove(@Param("id") id: string) {
		return this.academicYearService.remove(id);
	}
}
