import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import { GradeLevel } from "../models/grade-level.entity";
import {
	CreateStreamDto,
	StreamDto,
	UpdateStreamDto,
} from "../models/stream.dto";
import { Stream } from "../models/stream.entity";
import { StudentEnrollment } from "../models/student-enrollment.entity";

@Injectable()
export class StreamService {
	constructor(
		@InjectRepository(Stream)
		private readonly streamRepo: Repository<Stream>,
		@InjectRepository(GradeLevel)
		private readonly gradeLevelRepo: Repository<GradeLevel>,
	) {}

	async findAll(gradeLevelId: string): Promise<StreamDto[]> {
		return plainToInstance(
			StreamDto,
			await this.streamRepo.find({
				where: { gradeLevel: { id: gradeLevelId } },
				relations: ["gradeLevel"],
				order: { name: "ASC" },
			}),
			{ excludeExtraneousValues: true },
		);
	}

	async findOne(id: string): Promise<StreamDto> {
		const stream = await this.streamRepo.findOne({
			where: { id },
			relations: [
				"gradeLevel",
				"classTeachers",
				"classTeachers.staff",
				"classTeachers.academicYear",
				"subjectTeachers",
				"subjectTeachers.staff",
				"subjectTeachers.gradeSubject",
				"subjectTeachers.gradeSubject.subject",
				"gradeLevel",
				"classTeachers",
				"classTeachers.staff",
				"classTeachers.academicYear",
				"subjectTeachers",
				"subjectTeachers.staff",
				"subjectTeachers.gradeSubject",
				"subjectTeachers.gradeSubject.subject",
			],
		});
		if (!stream) throw new NotFoundException(`Stream ${id} not found`);
		return plainToInstance(StreamDto, stream, {
			excludeExtraneousValues: true,
		});
	}

	async countEnrollments(streamId: string, termId: string): Promise<number> {
		return this.streamRepo.manager.count(StudentEnrollment, {
			where: { stream: { id: streamId }, term: { id: termId } },
		});
	}

	async create(dto: CreateStreamDto): Promise<StreamDto> {
		const gradeLevel = await this.gradeLevelRepo.findOne({
			where: { id: dto.gradeLevelId },
		});
		if (!gradeLevel)
			throw new NotFoundException(`Grade level ${dto.gradeLevelId} not found`);

		const duplicate = await this.streamRepo.findOne({
			where: { gradeLevel: { id: dto.gradeLevelId }, name: dto.name },
		});
		if (duplicate)
			throw new ConflictException(
				`Stream "${dto.name}" already exists in this grade level`,
			);

		const stream = this.streamRepo.create({
			name: dto.name,
			capacity: dto.capacity,
			gradeLevel: gradeLevel,
		});
		return plainToInstance(StreamDto, await this.streamRepo.save(stream), {
			excludeExtraneousValues: true,
		});
	}

	async update(id: string, dto: UpdateStreamDto): Promise<StreamDto> {
		const stream = await this.streamRepo.findOne({
			where: { id },
			relations: ["gradeLevel"],
		});
		if (!stream) throw new NotFoundException(`Stream ${id} not found`);
		Object.assign(stream, dto);
		return plainToInstance(StreamDto, await this.streamRepo.save(stream), {
			excludeExtraneousValues: true,
		});
	}

	async remove(id: string): Promise<void> {
		const stream = await this.streamRepo.findOne({ where: { id } });
		if (!stream) throw new NotFoundException(`Stream ${id} not found`);
		await this.streamRepo.remove(stream);
	}
}
