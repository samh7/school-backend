import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "../Models/1.SchoolEntity";
import { Subject } from "../Models/6.SubjectEntity";
import { SubjectController } from "./6.SubjectController";
import { SubjectService } from "./6.SubjectService";

@Module({
	imports: [TypeOrmModule.forFeature([Subject, School])],
	controllers: [SubjectController],
	providers: [SubjectService],
	exports: [SubjectService],
})
export class SubjectModule {}
