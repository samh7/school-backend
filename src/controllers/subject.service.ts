import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import { School } from "../models/school.entity";
import {
	CreateSubjectDto,
	SubjectDto,
	UpdateSubjectDto,
} from "../models/subject.dto";
import { Subject } from "../models/subject.entity";

@Injectable()
export class SubjectService {
	constructor(
		@InjectRepository(Subject)
		private readonly subjectRepo: Repository<Subject>,
		@InjectRepository(School)
		private readonly schoolRepo: Repository<School>,
	) {}

	async findAll(schoolId: string): Promise<SubjectDto[]> {
		return plainToInstance(
			SubjectDto,
			await this.subjectRepo.find({
				where: { school: { id: schoolId } },
				order: { name: "ASC" },
			}),
			{ excludeExtraneousValues: true },
		);
	}

	async findOne(id: string): Promise<SubjectDto> {
		const subject = await this.subjectRepo.findOne({
			where: { id },
			relations: ["school", "gradeSubjects", "gradeSubjects.gradeLevel"],
		});
		if (!subject) throw new NotFoundException(`Subject ${id} not found`);
		return plainToInstance(SubjectDto, subject, {
			excludeExtraneousValues: true,
		});
	}

	async create(dto: CreateSubjectDto): Promise<SubjectDto> {
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
		return plainToInstance(SubjectDto, await this.subjectRepo.save(subject), {
			excludeExtraneousValues: true,
		});
	}

	async update(id: string, dto: UpdateSubjectDto): Promise<SubjectDto> {
		const subject = await this.subjectRepo.findOne({
			where: { id },
			relations: ["school", "gradeSubjects", "gradeSubjects.gradeLevel"],
		});
		if (!subject) throw new NotFoundException(`Subject ${id} not found`);
		Object.assign(subject, dto);
		return plainToInstance(SubjectDto, await this.subjectRepo.save(subject), {
			excludeExtraneousValues: true,
		});
	}

	async remove(id: string): Promise<void> {
		const subject = await this.subjectRepo.findOne({ where: { id } });
		if (!subject) throw new NotFoundException(`Subject ${id} not found`);
		await this.subjectRepo.remove(subject);
	}
}
