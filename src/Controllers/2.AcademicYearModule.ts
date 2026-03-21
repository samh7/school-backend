import { Module } from "@nestjs/common";
import { AcademicYearController } from "./2.AcademicYearController";

@Module({
	imports: [],
	controllers: [AcademicYearController],
	providers: [],
})
export class AcademicYearModule { }
