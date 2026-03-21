export class CreateGradeLevelDto {
	SchoolId: string;
	Name: string;         // e.g. "Grade 4"
	CbcLevel: string;     // pre-primary | lower-primary | upper-primary | junior-secondary
	SortOrder: number;
}

export class UpdateGradeLevelDto {
	Name?: string;
	CbcLevel?: string;
	SortOrder?: number;
}
