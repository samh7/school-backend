import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateSchoolDto, UpdateSchoolDto } from "../Models/1.SchoolDto";
import { School } from "../Models/1.SchoolEntity";

@Injectable()
export class SchoolService {
	constructor(
		@InjectRepository(School)
		private readonly schoolRepo: Repository<School>,
	) { }

	async findAll(): Promise<School[]> {
		return this.schoolRepo.find({
			order: { Name: 'ASC' },
		});
	}

	async findOne(id: string): Promise<School> {
		const school = await this.schoolRepo.findOne({
			where: { Id: id },
			relations: ['AcademicYears', 'GradeLevels', 'Subjects'],
		});
		if (!school) throw new NotFoundException(`School ${id} not found`);
		return school;
	}

	async create(dto: CreateSchoolDto): Promise<School> {
		if (dto.KnecCode) {
			const existing = await this.schoolRepo.findOne({ where: { KnecCode: dto.KnecCode } });
			if (existing) throw new ConflictException(`KNEC code ${dto.KnecCode} is already registered`);
		}
		const school = this.schoolRepo.create({ ...dto });
		return this.schoolRepo.save(school);
	}

	async update(id: string, dto: UpdateSchoolDto): Promise<School> {
		const school = await this.findOne(id);
		Object.assign(school, dto);
		return this.schoolRepo.save(school);
	}

	async remove(id: string): Promise<void> {
		const school = await this.findOne(id);
		await this.schoolRepo.remove(school);
	}
}
