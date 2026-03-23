import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import {
	CreateGradeLevelDto,
	GradeLevelDto,
	UpdateGradeLevelDto,
} from "../models/grade-level.dto";
import { GradeLevel } from "../models/grade-level.entity";
import { School } from "../models/school.entity";

@Injectable()
export class GradeLevelService {
	constructor(
		@InjectRepository(GradeLevel)
		private readonly gradeLevelRepo: Repository<GradeLevel>,
		@InjectRepository(School)
		private readonly schoolRepo: Repository<School>,
	) {}

	async findAll(schoolId: string): Promise<GradeLevelDto[]> {
		return plainToInstance(
			GradeLevelDto,
			await this.gradeLevelRepo.find({
				where: { school: { id: schoolId } },
				relations: ["streams", "gradeSubjects", "gradeSubjects.subject"],
				order: { sortOrder: "ASC" },
			}),
			{ excludeExtraneousValues: true },
		);
	}

	async findOne(id: string): Promise<GradeLevelDto> {
		const gradeLevel = await this.gradeLevelRepo.findOne({
			where: { id },
			relations: [
				"school",
				"streams",
				"gradeSubjects",
				"gradeSubjects.subject",
			],
		});
		if (!gradeLevel) throw new NotFoundException(`Grade level ${id} not found`);
		return plainToInstance(GradeLevelDto, gradeLevel, {
			excludeExtraneousValues: true,
		});
	}

	async create(dto: CreateGradeLevelDto): Promise<GradeLevelDto> {
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
		return plainToInstance(
			GradeLevelDto,
			await this.gradeLevelRepo.save(gradeLevel),
			{ excludeExtraneousValues: true },
		);
	}

	async update(id: string, dto: UpdateGradeLevelDto): Promise<GradeLevelDto> {
		const gradeLevel = await this.gradeLevelRepo.findOne({
			where: { id },
			relations: [
				"school",
				"streams",
				"gradeSubjects",
				"gradeSubjects.subject",
			],
		});
		if (!gradeLevel) throw new NotFoundException(`Grade level ${id} not found`);
		Object.assign(gradeLevel, dto);
		return plainToInstance(
			GradeLevelDto,
			await this.gradeLevelRepo.save(gradeLevel),
			{ excludeExtraneousValues: true },
		);
	}

	async remove(id: string): Promise<void> {
		const gradeLevel = await this.gradeLevelRepo.findOne({ where: { id } });
		if (!gradeLevel) throw new NotFoundException(`Grade level ${id} not found`);
		await this.gradeLevelRepo.remove(gradeLevel);
	}
}
