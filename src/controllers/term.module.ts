import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AcademicYear } from "../models/academic-year.entity";
import { Term } from "../models/term.entity";
import { TermController } from "./term.controller";
import { TermService } from "./term.service";

@Module({
	imports: [TypeOrmModule.forFeature([Term, AcademicYear])],
	controllers: [TermController],
	providers: [TermService],
	exports: [TermService],
})
export class TermModule {}
