import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AcademicYear } from "../Models/2.AcademicYearEntity";
import { Term } from "../Models/3.TermEntity";
import { TermController } from "./3.TermController";
import { TermService } from "./3.TermService";

@Module({
	imports: [TypeOrmModule.forFeature([Term, AcademicYear])],
	controllers: [TermController],
	providers: [TermService],
	exports: [TermService]

})
export class TermModule { }
