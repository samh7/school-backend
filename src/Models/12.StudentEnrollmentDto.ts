export class CreateEnrollmentDto {
	StudentId: string;
	StreamId: string;
	AcademicYearId: string;
	TermId: string;
	EnrollmentDate: Date;
}

export class UpdateEnrollmentDto {
	Status?: string;      // active | completed | transferred_out | transferred_in
}

export class BulkRolloverDto {
	// Copies all completed enrollments from FromTermId into ToTermId
	// Stream assignments remain the same — promotion is handled separately
	FromTermId: string;
	ToTermId: string;
	AcademicYearId: string;
}
