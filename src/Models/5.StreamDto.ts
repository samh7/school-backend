export class CreateStreamDto {
	GradeLevelId: string;
	Name: string;         // e.g. "North"
	Capacity?: number;
}

export class UpdateStreamDto {
	Name?: string;
	Capacity?: number;
}
