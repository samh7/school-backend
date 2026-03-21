export class CreateStudentDto {
	SchoolId: string;
	AdmissionNumber: string;
	FirstName: string;
	LastName: string;
	DateOfBirth?: Date;
	Gender?: string;      // male | female
	NemisId?: string;
	AdmissionDate: Date;
}

export class UpdateStudentDto {
	FirstName?: string;
	LastName?: string;
	DateOfBirth?: Date;
	Gender?: string;
	NemisId?: string;
	Status?: string;      // active | transferred | completed | deferred | expelled
}
