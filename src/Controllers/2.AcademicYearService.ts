import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { School } from "../Models/1.SchoolEntity";
import {
	CreateAcademicYearDto,
	UpdateAcademicYearDto,
} from "../Models/2.AcademicYearDto";
import { AcademicYear } from "../Models/2.AcademicYearEntity";

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
			where: { School: { Id: schoolId } },
			relations: ["Terms"],
			order: { StartDate: "DESC" },
		});
	}

	async findOne(id: string): Promise<AcademicYear> {
		const year = await this.academicYearRepo.findOne({
			where: { Id: id },
			relations: ["School", "Terms"],
		});
		if (!year) throw new NotFoundException(`Academic year ${id} not found`);
		return year;
	}

	async findCurrent(schoolId: string): Promise<AcademicYear> {
		const year = await this.academicYearRepo.findOne({
			where: { School: { Id: schoolId }, IsCurrent: true },
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
			where: { Id: dto.SchoolId },
		});
		if (!school)
			throw new NotFoundException(`School ${dto.SchoolId} not found`);

		const duplicate = await this.academicYearRepo.findOne({
			where: { School: { Id: dto.SchoolId }, Label: dto.Label },
		});
		if (duplicate)
			throw new ConflictException(
				`Academic year "${dto.Label}" already exists`,
			);

		if (dto.IsCurrent) await this.clearCurrent(dto.SchoolId);

		const year = this.academicYearRepo.create({
			Label: dto.Label,
			StartDate: dto.StartDate,
			EndDate: dto.EndDate,
			IsCurrent: dto.IsCurrent ?? false,
			School: school,
		});
		return this.academicYearRepo.save(year);
	}

	async update(id: string, dto: UpdateAcademicYearDto): Promise<AcademicYear> {
		const year = await this.findOne(id);
		if (dto.IsCurrent) await this.clearCurrent(year.School.Id);
		Object.assign(year, dto);
		return this.academicYearRepo.save(year);
	}

	async setCurrent(id: string): Promise<AcademicYear> {
		const year = await this.findOne(id);
		await this.clearCurrent(year.School.Id);
		year.IsCurrent = true;
		return this.academicYearRepo.save(year);
	}

	async remove(id: string): Promise<void> {
		const year = await this.findOne(id);
		if (year.IsCurrent)
			throw new ConflictException("Cannot delete the current academic year");
		await this.academicYearRepo.remove(year);
	}

	private async clearCurrent(schoolId: string): Promise<void> {
		await this.academicYearRepo.update(
			{ School: { Id: schoolId }, IsCurrent: true },
			{ IsCurrent: false },
		);
	}
}
