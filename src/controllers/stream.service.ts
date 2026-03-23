import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StudentEnrollment } from "../models/student-enrollment.entity";
import { GradeLevel } from "../models/grade-level.entity";
import { CreateStreamDto, UpdateStreamDto } from "../models/stream.dto";
import { Stream } from "../models/stream.entity";

@Injectable()
export class StreamService {
	constructor(
		@InjectRepository(Stream)
		private readonly streamRepo: Repository<Stream>,
		@InjectRepository(GradeLevel)
		private readonly gradeLevelRepo: Repository<GradeLevel>,
	) {}

	async findAll(gradeLevelId: string): Promise<Stream[]> {
		return this.streamRepo.find({
			where: { gradeLevel: { id: gradeLevelId } },
			relations: ["GradeLevel"],
			order: { name: "ASC" },
		});
	}

	async findOne(id: string): Promise<Stream> {
		const stream = await this.streamRepo.findOne({
			where: { id: id },
			relations: [
				"GradeLevel",
				"ClassTeachers",
				"ClassTeachers.Staff",
				"ClassTeachers.AcademicYear",
				"SubjectTeachers",
				"SubjectTeachers.Staff",
				"SubjectTeachers.GradeSubject",
				"SubjectTeachers.GradeSubject.Subject",
			],
		});
		if (!stream) throw new NotFoundException(`Stream ${id} not found`);
		return stream;
	}

	async countEnrollments(streamId: string, termId: string): Promise<number> {
		return this.streamRepo.manager.count(StudentEnrollment, {
			where: { stream: { id: streamId }, term: { id: termId } },
		});
	}

	async create(dto: CreateStreamDto): Promise<Stream> {
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
		return this.streamRepo.save(stream);
	}

	async update(id: string, dto: UpdateStreamDto): Promise<Stream> {
		const stream = await this.findOne(id);
		Object.assign(stream, dto);
		return this.streamRepo.save(stream);
	}

	async remove(id: string): Promise<void> {
		const stream = await this.findOne(id);
		await this.streamRepo.remove(stream);
	}
}
