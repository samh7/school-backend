import { IntersectionType, PartialType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { BaseCreateDto, BaseDto } from "./0.BaseDto";
import { RoleEnum } from "./Types/RoleEnum";

export class StaffDto extends BaseDto {
	@IsString()

	@Expose() SchoolId: string;
	@IsString()

	@Expose() FirstName: string;
	@IsString()

	@Expose() LastName: string;
	@IsString()

	@Expose() Email: string;
	@IsString()
	@IsOptional()

	@Expose() Phone?: string;
	@IsEnum(RoleEnum)

	@Expose() Role: RoleEnum;
	@IsString()
	@IsOptional()     //STAFFrOL // teacher | principal | bursar | hod | admin

	@Expose() TscNumber?: string;
}

export class CreateStaffDto extends IntersectionType(StaffDto, BaseCreateDto) { }
export class UpdateStaffDto extends PartialType(CreateStaffDto) { }

// teachers
export class AssignClassTeacherDto {

	@IsString()
	StaffId: string;
	@IsString()
	StreamId: string;
	@IsString()
	AcademicYearId: string;

}

export class AssignSubjectTeacherDto {

	@IsString()
	StaffId: string;
	@IsString()
	GradeSubjectId: string;
	@IsString()
	StreamId: string;
	@IsString()
	AcademicYearId: string;
}
