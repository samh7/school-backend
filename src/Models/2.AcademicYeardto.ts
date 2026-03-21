export class CreateAcademicYearDto {
	SchoolId: string;
	Label: string;       // e.g. "2024"
	StartDate: Date;
	EndDate: Date;
	IsCurrent?: boolean;
}

export class UpdateAcademicYearDto {
	Label?: string;
	StartDate?: Date;
	EndDate?: Date;
	IsCurrent?: boolean;
}
