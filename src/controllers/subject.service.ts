import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { School } from "../models/school.entity";
import { CreateSubjectDto, UpdateSubjectDto } from "../models/subject.dto";
import { Subject } from "../models/subject.entity";

@Injectable()
export class SubjectService {
	constructor(
		@InjectRepository(Subject)
		private readonly subjectRepo: Repository<Subject>,
		@InjectRepository(School)
		private readonly schoolRepo: Repository<School>,
	) {}

	async findAll(schoolId: string): Promise<Subject[]> {
		return this.subjectRepo.find({
			where: { school: { id: schoolId } },
			order: { name: "ASC" },
		});
	}

	// async findByLevel(schoolId: string, levelType: string): Promise<Subject[]> {
	// 	return this.subjectRepo.find({
	// 		where: { School: { Id: schoolId }, LevelType: levelType },
	// 		order: { Name: 'ASC' },
	// 	});
	// }

	async findOne(id: string): Promise<Subject> {
		const subject = await this.subjectRepo.findOne({
			where: { id: id },
			relations: ["School", "GradeSubjects", "GradeSubjects.GradeLevel"],
		});
		if (!subject) throw new NotFoundException(`Subject ${id} not found`);
		return subject;
	}

	async create(dto: CreateSubjectDto): Promise<Subject> {
		const school = await this.schoolRepo.findOne({
			where: { id: dto.schoolId },
		});
		if (!school)
			throw new NotFoundException(`School ${dto.schoolId} not found`);

		const duplicate = await this.subjectRepo.findOne({
			where: { school: { id: dto.schoolId }, code: dto.code },
		});
		if (duplicate)
			throw new ConflictException(`Subject code "${dto.code}" already exists`);

		const subject = this.subjectRepo.create({ ...dto, school: school });
		return this.subjectRepo.save(subject);
	}

	async update(id: string, dto: UpdateSubjectDto): Promise<Subject> {
		const subject = await this.findOne(id);
		Object.assign(subject, dto);
		return this.subjectRepo.save(subject);
	}

	async remove(id: string): Promise<void> {
		const subject = await this.findOne(id);
		await this.subjectRepo.remove(subject);
	}
}
