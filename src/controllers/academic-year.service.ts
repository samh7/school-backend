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
	AcademicYearDto,
	CreateAcademicYearDto,
	UpdateAcademicYearDto,
} from "../models/academic-year.dto";
import { AcademicYear } from "../models/academic-year.entity";

@Injectable()
export class AcademicYearService {
	constructor(
		@InjectRepository(AcademicYear)
		private readonly academicYearRepo: Repository<AcademicYear>,
		@InjectRepository(School)
		private readonly schoolRepo: Repository<School>,
	) {}

	async findAll(schoolId: string): Promise<AcademicYearDto[]> {
		const years = await this.academicYearRepo.find({
			where: { school: { id: schoolId } },
			relations: ["terms"],
			order: { startDate: "DESC" },
		});
		return plainToInstance(AcademicYearDto, years, {
			excludeExtraneousValues: true,
		});
	}

	async findOne(id: string): Promise<AcademicYearDto> {
		const year = await this.academicYearRepo.findOne({
			where: { id },
			relations: ["school", "terms"],
		});
		if (!year) throw new NotFoundException(`Academic year ${id} not found`);
		return plainToInstance(AcademicYearDto, year, {
			excludeExtraneousValues: true,
		});
	}

	async findCurrent(schoolId: string): Promise<AcademicYearDto> {
		const year = await this.academicYearRepo.findOne({
			where: { school: { id: schoolId }, isCurrent: true },
			relations: ["terms"],
		});
		if (!year)
			throw new NotFoundException(
				`No current academic year found for school ${schoolId}`,
			);
		return plainToInstance(AcademicYearDto, year, {
			excludeExtraneousValues: true,
		});
	}

	async create(dto: CreateAcademicYearDto): Promise<AcademicYearDto> {
		const school = await this.schoolRepo.findOne({
			where: { id: dto.schoolId },
		});
		if (!school)
			throw new NotFoundException(`School ${dto.schoolId} not found`);

		const duplicate = await this.academicYearRepo.findOne({
			where: { school: { id: dto.schoolId }, label: dto.label },
		});
		if (duplicate)
			throw new ConflictException(
				`Academic year "${dto.label}" already exists`,
			);

		if (dto.isCurrent) await this.clearCurrent(dto.schoolId);

		const year = this.academicYearRepo.create({
			label: dto.label,
			startDate: dto.startDate,
			endDate: dto.endDate,
			isCurrent: dto.isCurrent ?? false,
			school: school,
		});
		return plainToInstance(
			AcademicYearDto,
			await this.academicYearRepo.save(year),
			{ excludeExtraneousValues: true },
		);
	}

	async update(
		id: string,
		dto: UpdateAcademicYearDto,
	): Promise<AcademicYearDto> {
		const year = await this.academicYearRepo.findOne({
			where: { id },
			relations: ["school", "terms"],
		});
		if (!year) throw new NotFoundException(`Academic year ${id} not found`);
		if (dto.isCurrent) await this.clearCurrent(year.school.id);
		Object.assign(year, dto);
		return plainToInstance(
			AcademicYearDto,
			await this.academicYearRepo.save(year),
			{ excludeExtraneousValues: true },
		);
	}

	async setCurrent(id: string): Promise<AcademicYearDto> {
		const year = await this.academicYearRepo.findOne({
			where: { id },
			relations: ["school", "terms"],
		});
		if (!year) throw new NotFoundException(`Academic year ${id} not found`);
		await this.clearCurrent(year.school.id);
		year.isCurrent = true;
		return plainToInstance(
			AcademicYearDto,
			await this.academicYearRepo.save(year),
			{ excludeExtraneousValues: true },
		);
	}

	async remove(id: string): Promise<void> {
		const year = await this.academicYearRepo.findOne({ where: { id } });
		if (!year) throw new NotFoundException(`Academic year ${id} not found`);
		if (year.isCurrent)
			throw new ConflictException("Cannot delete the current academic year");
		await this.academicYearRepo.remove(year);
	}

	private async clearCurrent(schoolId: string): Promise<void> {
		await this.academicYearRepo.update(
			{ school: { id: schoolId }, isCurrent: true },
			{ isCurrent: false },
		);
	}
}
