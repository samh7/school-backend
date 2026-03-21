import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../Models/1.SchoolEntity";
import { AcademicYear } from "../Models/2.AcademicYearEntity";
import { AcademicYearController } from "./2.AcademicYearController";
import { AcademicYearService } from "./2.AcademicYearService";

@Module({
	imports: [TypeOrmModule.forFeature([AcademicYear, School])],
	controllers: [AcademicYearController],
	providers: [AcademicYearService],
	exports: [AcademicYearService]
})
export class AcademicYearModule { }
