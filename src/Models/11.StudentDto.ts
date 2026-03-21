import { Expose } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class CreateStudentDto {
	@IsString()
	@Expose()
	SchoolId: string;
	@IsString()
	@Expose()
	AdmissionNumber: string;
	@IsString()
	@Expose()
	FirstName: string;
	@IsString()
	@Expose()
	LastName: string;
	@IsDate()
	@IsOptional()
	@Expose()
	DateOfBirth?: Date;
	@IsString()
	@IsOptional()
	@Expose()
	Gender?: string;      // male | female
	@IsString()
	@IsOptional()
	@Expose()
	NemisId?: string;
	@IsDate()
	@Expose()
	AdmissionDate: Date;
}

export class UpdateStudentDto {
	@IsString()
	@IsOptional()
	@Expose()
	FirstName?: string;
	@IsString()
	@IsOptional()
	@Expose()
	LastName?: string;
	@IsDate()
	@IsOptional()
	@Expose()
	DateOfBirth?: Date;
	@IsString()
	@IsOptional()
	@Expose()
	Gender?: string;
	@IsString()
	@IsOptional()
	@Expose()
	NemisId?: string;
	@IsString()
	@IsOptional()
	@Expose()
	Status?: string;      // active | transferred | completed | deferred | expelled
}
