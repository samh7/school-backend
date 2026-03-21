export class CreateSubjectDto {
	SchoolId: string;
	Name: string;
	Code: string;
	CbcLearningArea: string;
	LevelType: string;    // pre-primary | lower-primary | upper-primary | junior-secondary
}

export class UpdateSubjectDto {
	Name?: string;
	Code?: string;
	CbcLearningArea?: string;
	LevelType?: string;
}
