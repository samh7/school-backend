import { OmitType, PartialType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { BASE_DTO_KEYS, BaseDto } from "./0.BaseDto";
import { RoleEnum } from "./Types/RoleEnum";

export class StaffDto extends BaseDto {
	@IsString()
	@Expose()
	SchoolId: string;
	@IsString()
	@Expose()
	FirstName: string;
	@IsString()
	@Expose()
	LastName: string;
	@IsString()
	@Expose()
	Email: string;
	@IsString()
	@IsOptional()
	@Expose()
	Phone?: string;
	@IsEnum(RoleEnum)
	@Expose()
	Role: RoleEnum;
	@IsString()
	@IsOptional() //STAFFrOL // teacher | principal | bursar | hod | admin
	@Expose()
	TscNumber?: string;

	@IsDateString()
	@Expose()
	JoinDate: Date;

	@IsString()
	@Expose()
	Status: string;
}

export class CreateStaffDto extends OmitType(StaffDto, BASE_DTO_KEYS) {}
export class CreateStaffWithoutSchoolDto extends OmitType(CreateStaffDto, [
	"SchoolId",
] as const) {}

export class UpdateStaffDto extends PartialType(CreateStaffDto) {}

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
