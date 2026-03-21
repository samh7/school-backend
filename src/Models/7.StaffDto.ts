import { RoleEnum } from "./types/RoleEnum";

export class CreateStaffDto {
	SchoolId: string;
	FirstName: string;
	LastName: string;
	Email: string;
	Phone?: string;
	Role: RoleEnum;        //STAFFrOL // teacher | principal | bursar | hod | admin
	TscNumber?: string;
}

export class UpdateStaffDto {
	FirstName?: string;
	LastName?: string;
	Email?: string;
	Phone?: string;
	Role?: string;
	TscNumber?: string;
	Status?: string;      // active | inactive | suspended
}


export class AssignClassTeacherDto {
	StaffId: string;
	StreamId: string;
	AcademicYearId: string;
}

export class AssignSubjectTeacherDto {
	StaffId: string;
	GradeSubjectId: string;
	StreamId: string;
	AcademicYearId: string;
}


export class StaffDto {
	Id: string;
	FirstName: string;
	LastName: string;
	SchoolId: string;
}
