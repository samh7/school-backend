import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { School } from "../Models/1.SchoolEntity";
import { CreateGradeLevelDto, UpdateGradeLevelDto } from "../Models/4.GradeLevelDto";
import { GradeLevel } from "../Models/4.GradeLevelEntity";

@Injectable()
export class GradeLevelService {
	constructor(
		@InjectRepository(GradeLevel)
		private readonly gradeLevelRepo: Repository<GradeLevel>,
		@InjectRepository(School)
		private readonly schoolRepo: Repository<School>,
	) { }

	async findAll(schoolId: string): Promise<GradeLevel[]> {
		return this.gradeLevelRepo.find({
			where: { School: { Id: schoolId } },
			relations: ['Streams', 'GradeSubjects', 'GradeSubjects.Subject'],
			order: { SortOrder: 'ASC' },
		});
	}

	async findOne(id: string): Promise<GradeLevel> {
		const gradeLevel = await this.gradeLevelRepo.findOne({
			where: { Id: id },
			relations: ['School', 'Streams', 'GradeSubjects', 'GradeSubjects.Subject'],
		});
		if (!gradeLevel) throw new NotFoundException(`Grade level ${id} not found`);
		return gradeLevel;
	}

	async create(dto: CreateGradeLevelDto): Promise<GradeLevel> {
		const school = await this.schoolRepo.findOne({ where: { Id: dto.SchoolId } });
		if (!school) throw new NotFoundException(`School ${dto.SchoolId} not found`);

		const duplicate = await this.gradeLevelRepo.findOne({
			where: { School: { Id: dto.SchoolId }, Name: dto.Name },
		});
		if (duplicate) throw new ConflictException(`Grade level "${dto.Name}" already exists`);

		const gradeLevel = this.gradeLevelRepo.create({
			Name: dto.Name,
			CbcLevel: dto.CbcLevel,
			SortOrder: dto.SortOrder,
			School: school,
		});
		return this.gradeLevelRepo.save(gradeLevel);
	}

	async update(id: string, dto: UpdateGradeLevelDto): Promise<GradeLevel> {
		const gradeLevel = await this.findOne(id);
		Object.assign(gradeLevel, dto);
		return this.gradeLevelRepo.save(gradeLevel);
	}

	async remove(id: string): Promise<void> {
		const gradeLevel = await this.findOne(id);
		await this.gradeLevelRepo.remove(gradeLevel);
	}
}
