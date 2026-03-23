import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import {
	CreateSchoolDto,
	SchoolDto,
	UpdateSchoolDto,
} from "../models/school.dto";
import { School } from "../models/school.entity";

@Injectable()
export class SchoolService {
	constructor(
		@InjectRepository(School)
		private readonly schoolRepo: Repository<School>,
	) {}

	async findAll(): Promise<SchoolDto[]> {
		return plainToInstance(
			SchoolDto,
			await this.schoolRepo.find({ order: { name: "ASC" } }),
			{ excludeExtraneousValues: true },
		);
	}

	async findOne(id: string): Promise<SchoolDto> {
		const school = await this.schoolRepo.findOne({
			where: { id },
			relations: ["academicYears", "gradeLevels", "subjects"],
		});
		if (!school) throw new NotFoundException(`School ${id} not found`);
		return plainToInstance(SchoolDto, school, {
			excludeExtraneousValues: true,
		});
	}

	async create(dto: CreateSchoolDto): Promise<SchoolDto> {
		if (dto.knecCode) {
			const existing = await this.schoolRepo.findOne({
				where: { knecCode: dto.knecCode },
			});
			if (existing)
				throw new ConflictException(
					`KNEC code ${dto.knecCode} is already registered`,
				);
		}
		const school = this.schoolRepo.create(dto);
		return plainToInstance(SchoolDto, await this.schoolRepo.save(school), {
			excludeExtraneousValues: true,
		});
	}

	async update(id: string, dto: UpdateSchoolDto): Promise<SchoolDto> {
		const school = await this.schoolRepo.findOne({
			where: { id },
			relations: ["academicYears", "gradeLevels", "subjects"],
		});
		if (!school) throw new NotFoundException(`School ${id} not found`);
		Object.assign(school, dto);
		return plainToInstance(SchoolDto, await this.schoolRepo.save(school), {
			excludeExtraneousValues: true,
		});
	}

	async remove(id: string): Promise<void> {
		const school = await this.schoolRepo.findOne({ where: { id } });
		if (!school) throw new NotFoundException(`School ${id} not found`);
		await this.schoolRepo.remove(school);
	}
}
