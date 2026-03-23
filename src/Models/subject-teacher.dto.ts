import { Expose } from "class-transformer";
import { IsString } from "class-validator";
import { Entity } from "typeorm";

@Entity("subject_teachers")
export class SubjectTeacherDto {
	@Expose()
	@IsString()
	staffId: string;

	@Expose()
	@IsString()
	gradeSubjectId: string;

	@Expose()
	@IsString()
	streamId: string;

	@Expose()
	@IsString()
	academicYearId: string;
}
