import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../models/school.entity";
import { AcademicYear } from "../models/academic-year.entity";
import { AcademicYearController } from "./academic-year.controller";
import { AcademicYearService } from "./academic-year.service";

@Module({
	imports: [TypeOrmModule.forFeature([AcademicYear, School])],
	controllers: [AcademicYearController],
	providers: [AcademicYearService],
	exports: [AcademicYearService],
})
export class AcademicYearModule {}
