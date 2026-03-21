import { Expose } from "class-transformer";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { RoleEnum } from "./Types/RoleEnum";

export class StaffDto {
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

export class CreateStaffDto {
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

export class UpdateStaffDto {
	@IsString()
	@IsOptional()
	FirstName?: string;
	@IsString()
	@IsOptional()
	LastName?: string;
	@IsString()
	@IsOptional()
	Email?: string;
	@IsString()
	@IsOptional()
	Phone?: string;

	@IsString()
	@IsOptional()
	Role?: string;

	@IsString()
	@IsOptional()
	TscNumber?: string;

	@IsString()
	@IsOptional()
	Status?: string;      // active | inactive | suspended
}


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


export class StaffDtoMinimal {
	@IsString()
	Id: string;
	@IsString()
	FirstName: string;
	@IsString()
	LastName: string;
	@IsString()
	SchoolId: string;
}
