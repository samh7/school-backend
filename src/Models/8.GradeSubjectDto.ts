
export class CreateGradeSubjectDto {
	GradeLevelId: string;
	SubjectId: string;
	IsExaminable: boolean;
	PeriodsPerWeek: number;
}

export class UpdateGradeSubjectDto {
	IsExaminable?: boolean;
	PeriodsPerWeek?: number;
}
