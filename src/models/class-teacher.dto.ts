import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class ClassTeacherDto {
	@Expose()
	@IsString()
	staffId: string;

	@Expose()
	@IsString()
	streamId: string;

	@Expose()
	@IsString()
	academicYearId: string;
}
