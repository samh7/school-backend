import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { School } from "../Models/1.SchoolEntity";
import {
	CreateGradeLevelDto,
	UpdateGradeLevelDto,
} from "../Models/4.GradeLevelDto";
import { GradeLevel } from "../Models/4.GradeLevelEntity";

@Injectable()
export class GradeLevelService {
	constructor(
		@InjectRepository(GradeLevel)
		private readonly gradeLevelRepo: Repository<GradeLevel>,
		@InjectRepository(School)
		private readonly schoolRepo: Repository<School>,
	) {}

	async findAll(schoolId: string): Promise<GradeLevel[]> {
		return this.gradeLevelRepo.find({
			where: { school: { id: schoolId } },
			relations: ["Streams", "GradeSubjects", "GradeSubjects.Subject"],
			order: { sortOrder: "ASC" },
		});
	}

	async findOne(id: string): Promise<GradeLevel> {
		const gradeLevel = await this.gradeLevelRepo.findOne({
			where: { id: id },
			relations: [
				"School",
				"Streams",
				"GradeSubjects",
				"GradeSubjects.Subject",
			],
		});
		if (!gradeLevel) throw new NotFoundException(`Grade level ${id} not found`);
		return gradeLevel;
	}

	async create(dto: CreateGradeLevelDto): Promise<GradeLevel> {
		const school = await this.schoolRepo.findOne({
			where: { id: dto.schoolId },
		});
		if (!school)
			throw new NotFoundException(`School ${dto.schoolId} not found`);

		const duplicate = await this.gradeLevelRepo.findOne({
			where: { school: { id: dto.schoolId }, name: dto.name },
		});
		if (duplicate)
			throw new ConflictException(`Grade level "${dto.name}" already exists`);

		const gradeLevel = this.gradeLevelRepo.create({
			name: dto.name,
			cbcLevel: dto.cbcLevel,
			sortOrder: dto.sortOrder,
			school: school,
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
