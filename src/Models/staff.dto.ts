import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { BASE_DTO_KEYS, BaseDto } from "./base.dto";
import { RoleEnum } from "./types/role-enum";

export class StaffDto extends BaseDto {
	@IsString()
	@Expose()
	schoolId: string;
	@IsString()
	@Expose()
	firstName: string;
	@IsString()
	@Expose()
	lastName: string;
	@IsString()
	@Expose()
	email: string;
	@IsString()
	@IsOptional()
	@Expose()
	phone?: string;
	@IsEnum(RoleEnum)
	@Expose()
	role: RoleEnum;
	@IsString()
	@IsOptional() //STAFFrOL // teacher | principal | bursar | hod | admin
	@Expose()
	tscNumber?: string;

	@IsDateString()
	@Expose()
	joinDate: Date;

	@IsString()
	@Expose()
	status: string;
}

export class CreateStaffDto extends OmitType(StaffDto, BASE_DTO_KEYS) {}
export class CreateStaffWithoutSchoolDto extends OmitType(CreateStaffDto, [
	"schoolId",
] as const) {}

export class UpdateStaffDto extends PartialType(CreateStaffDto) {}

// teachers
export class CreateStaffResponseDto extends StaffDto {
	@IsString()
	@Expose()
	TempPassword: string;
}

export class AssignClassTeacherDto {
	@IsString()
	staffId: string;
	@IsString()
	streamId: string;
	@IsString()
	academicYearId: string;
}

export class AssignSubjectTeacherDto {
	@IsString()
	staffId: string;
	@IsString()
	gradeSubjectId: string;
	@IsString()
	streamId: string;
	@IsString()
	academicYearId: string;
}
