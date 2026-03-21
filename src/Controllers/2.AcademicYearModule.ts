import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../Models/1.SchoolEntity";
import { AcademicYear } from "../Models/2.AcademicYearEntity";
import { AcademicYearController } from "./2.AcademicYearController";

@Module({
	imports: [TypeOrmModule.forFeature([AcademicYear, School])],
	controllers: [AcademicYearController],
	providers: [],
})
export class AcademicYearModule { }
