import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GradeLevel } from "../Models/4.GradeLevelEntity";
import { Stream } from "../Models/5.StreamEntity";
import { StreamController } from "./5.StreamController";

@Module({
	imports: [TypeOrmModule.forFeature([Stream, GradeLevel])],
	controllers: [StreamController]
})
export class StreamModule { }
