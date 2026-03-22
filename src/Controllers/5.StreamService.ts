import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StudentEnrollment } from "../Models/12.StudentEnrollmentEntity";
import { GradeLevel } from "../Models/4.GradeLevelEntity";
import { CreateStreamDto, UpdateStreamDto } from "../Models/5.StreamDto";
import { Stream } from "../Models/5.StreamEntity";

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
			where: { GradeLevel: { Id: gradeLevelId } },
			relations: ["GradeLevel"],
			order: { Name: "ASC" },
		});
	}

	async findOne(id: string): Promise<Stream> {
		const stream = await this.streamRepo.findOne({
			where: { Id: id },
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
			where: { Stream: { Id: streamId }, Term: { Id: termId } },
		});
	}

	async create(dto: CreateStreamDto): Promise<Stream> {
		const gradeLevel = await this.gradeLevelRepo.findOne({
			where: { Id: dto.GradeLevelId },
		});
		if (!gradeLevel)
			throw new NotFoundException(`Grade level ${dto.GradeLevelId} not found`);

		const duplicate = await this.streamRepo.findOne({
			where: { GradeLevel: { Id: dto.GradeLevelId }, Name: dto.Name },
		});
		if (duplicate)
			throw new ConflictException(
				`Stream "${dto.Name}" already exists in this grade level`,
			);

		const stream = this.streamRepo.create({
			Name: dto.Name,
			Capacity: dto.Capacity,
			GradeLevel: gradeLevel,
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
