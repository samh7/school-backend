import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GradeLevel } from "../models/grade-level.entity";
import { Stream } from "../models/stream.entity";
import { StreamController } from "./stream.controller";
import { StreamService } from "./stream.service";

@Module({
	imports: [TypeOrmModule.forFeature([Stream, GradeLevel])],
	controllers: [StreamController],
	providers: [StreamService],
	exports: [StreamService],
})
export class StreamModule {}
