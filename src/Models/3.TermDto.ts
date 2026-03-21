export class CreateTermDto {
	AcademicYearId: string;
	TermNumber: number;   // 1 | 2 | 3
	StartDate: Date;
	EndDate: Date;
	IsCurrent?: boolean;
}

export class UpdateTermDto {
	TermNumber?: number;
	StartDate?: Date;
	EndDate?: Date;
	IsCurrent?: boolean;
}
