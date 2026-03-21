import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { School } from "../Models/1.SchoolEntity";
import { CreateSubjectDto, UpdateSubjectDto } from "../Models/6.SubjectDto";
import { Subject } from "../Models/6.SubjectEntity";

@Injectable()
export class SubjectService {
	constructor(
		@InjectRepository(Subject)
		private readonly subjectRepo: Repository<Subject>,
		@InjectRepository(School)
		private readonly schoolRepo: Repository<School>,
	) { }

	async findAll(schoolId: string): Promise<Subject[]> {
		return this.subjectRepo.find({
			where: { School: { Id: schoolId } },
			order: { Name: 'ASC' },
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
			where: { Id: id },
			relations: ['School', 'GradeSubjects', 'GradeSubjects.GradeLevel'],
		});
		if (!subject) throw new NotFoundException(`Subject ${id} not found`);
		return subject;
	}

	async create(dto: CreateSubjectDto): Promise<Subject> {
		const school = await this.schoolRepo.findOne({ where: { Id: dto.SchoolId } });
		if (!school) throw new NotFoundException(`School ${dto.SchoolId} not found`);

		const duplicate = await this.subjectRepo.findOne({
			where: { School: { Id: dto.SchoolId }, Code: dto.Code },
		});
		if (duplicate) throw new ConflictException(`Subject code "${dto.Code}" already exists`);

		const subject = this.subjectRepo.create({ ...dto, School: school });
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
