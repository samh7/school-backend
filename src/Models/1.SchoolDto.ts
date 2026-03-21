import { SchoolTypeEnum } from "./types/SchoolType";

export class CreateSchoolDto {
	Name: string;
	KnecCode?: string;
	County?: string;
	SubCounty?: string;
	Phone?: string;
	Email?: string;
	SchoolType?: SchoolTypeEnum; // public | private | mission
}

export class UpdateSchoolDto {
	Name?: string;
	KnecCode?: string;
	County?: string;
	SubCounty?: string;
	Phone?: string;
	Email?: string;
	SchoolType?: string;
	IsActive?: boolean;
}
