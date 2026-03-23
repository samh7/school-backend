import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import { AcademicYear } from "../models/academic-year.entity";
import { CreateTermDto, TermDto, UpdateTermDto } from "../models/term.dto";
import { Term } from "../models/term.entity";

@Injectable()
export class TermService {
	constructor(
		@InjectRepository(Term)
		private readonly termRepo: Repository<Term>,
		@InjectRepository(AcademicYear)
		private readonly academicYearRepo: Repository<AcademicYear>,
	) {}

	async findAll(academicYearId: string): Promise<TermDto[]> {
		return plainToInstance(
			TermDto,
			await this.termRepo.find({
				where: { academicYear: { id: academicYearId } },
				order: { termNumber: "ASC" },
			}),
			{ excludeExtraneousValues: true },
		);
	}

	async findOne(id: string): Promise<TermDto> {
		const term = await this.termRepo.findOne({
			where: { id },
			relations: ["academicYear"],
		});
		if (!term) throw new NotFoundException(`Term ${id} not found`);
		return plainToInstance(TermDto, term, { excludeExtraneousValues: true });
	}

	async findCurrent(schoolId: string): Promise<TermDto> {
		const term = await this.termRepo.findOne({
			where: { isCurrent: true, academicYear: { schoolId } },
			relations: ["academicYear", "academicYear.school"],
		});
		if (!term) throw new NotFoundException("No current term is set");
		return plainToInstance(TermDto, term, { excludeExtraneousValues: true });
	}

	async create(schoolId: string, dto: CreateTermDto): Promise<TermDto> {
		const academicYear = await this.academicYearRepo.findOne({
			where: { id: dto.academicYearId, schoolId },
		});
		if (!academicYear)
			throw new NotFoundException(
				`Academic year ${dto.academicYearId} not found`,
			);

		const duplicate = await this.termRepo.findOne({
			where: {
				academicYear: { id: dto.academicYearId, schoolId },
				termNumber: dto.termNumber,
			},
		});
		if (duplicate)
			throw new ConflictException(
				`Term ${dto.termNumber} already exists for this academic year`,
			);

		if (dto.isCurrent) await this.clearCurrent();

		const term = this.termRepo.create({
			termNumber: dto.termNumber,
			startDate: dto.startDate,
			endDate: dto.endDate,
			isCurrent: dto.isCurrent ?? false,
			academicYear: academicYear,
		});
		return plainToInstance(TermDto, await this.termRepo.save(term), {
			excludeExtraneousValues: true,
		});
	}

	async update(id: string, dto: UpdateTermDto): Promise<TermDto> {
		const term = await this.termRepo.findOne({
			where: { id },
			relations: ["academicYear"],
		});
		if (!term) throw new NotFoundException(`Term ${id} not found`);
		if (dto.isCurrent) await this.clearCurrent();
		Object.assign(term, dto);
		return plainToInstance(TermDto, await this.termRepo.save(term), {
			excludeExtraneousValues: true,
		});
	}

	async setCurrent(id: string): Promise<TermDto> {
		const term = await this.termRepo.findOne({
			where: { id },
			relations: ["academicYear"],
		});
		if (!term) throw new NotFoundException(`Term ${id} not found`);
		await this.clearCurrent();
		term.isCurrent = true;
		return plainToInstance(TermDto, await this.termRepo.save(term), {
			excludeExtraneousValues: true,
		});
	}

	async remove(id: string): Promise<void> {
		const term = await this.termRepo.findOne({ where: { id } });
		if (!term) throw new NotFoundException(`Term ${id} not found`);
		if (term.isCurrent)
			throw new ConflictException("Cannot delete the current term");
		await this.termRepo.remove(term);
	}

	private async clearCurrent(): Promise<void> {
		await this.termRepo.update({ isCurrent: true }, { isCurrent: false });
	}
}
