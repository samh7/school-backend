import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../models/school.entity";
import { Subject } from "../models/subject.entity";
import { SubjectController } from "./subject.controller";
import { SubjectService } from "./subject.service";

@Module({
	imports: [TypeOrmModule.forFeature([Subject, School])],
	controllers: [SubjectController],
	providers: [SubjectService],
	exports: [SubjectService],
})
export class SubjectModule {}
