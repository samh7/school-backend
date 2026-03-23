import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { School } from "../models/school.entity";
import {
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

	async findAll(schoolId: string): Promise<AcademicYear[]> {
		return this.academicYearRepo.find({
			where: { school: { id: schoolId } },
			relations: ["Terms"],
			order: { startDate: "DESC" },
		});
	}

	async findOne(id: string): Promise<AcademicYear> {
		const year = await this.academicYearRepo.findOne({
			where: { id: id },
			relations: ["School", "Terms"],
		});
		if (!year) throw new NotFoundException(`Academic year ${id} not found`);
		return year;
	}

	async findCurrent(schoolId: string): Promise<AcademicYear> {
		const year = await this.academicYearRepo.findOne({
			where: { school: { id: schoolId }, isCurrent: true },
			relations: ["Terms"],
		});
		if (!year)
			throw new NotFoundException(
				`No current academic year found for school ${schoolId}`,
			);
		return year;
	}

	async create(dto: CreateAcademicYearDto): Promise<AcademicYear> {
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
		return this.academicYearRepo.save(year);
	}

	async update(id: string, dto: UpdateAcademicYearDto): Promise<AcademicYear> {
		const year = await this.findOne(id);
		if (dto.isCurrent) await this.clearCurrent(year.school.id);
		Object.assign(year, dto);
		return this.academicYearRepo.save(year);
	}

	async setCurrent(id: string): Promise<AcademicYear> {
		const year = await this.findOne(id);
		await this.clearCurrent(year.school.id);
		year.isCurrent = true;
		return this.academicYearRepo.save(year);
	}

	async remove(id: string): Promise<void> {
		const year = await this.findOne(id);
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
