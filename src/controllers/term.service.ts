import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AcademicYear } from "../models/academic-year.entity";
import { CreateTermDto, UpdateTermDto } from "../models/term.dto";
import { Term } from "../models/term.entity";

@Injectable()
export class TermService {
	constructor(
		@InjectRepository(Term)
		private readonly termRepo: Repository<Term>,
		@InjectRepository(AcademicYear)
		private readonly academicYearRepo: Repository<AcademicYear>,
	) {}

	async findAll(academicYearId: string): Promise<Term[]> {
		return this.termRepo.find({
			where: { academicYear: { id: academicYearId } },
			order: { termNumber: "ASC" },
		});
	}

	async findOne(id: string): Promise<Term> {
		const term = await this.termRepo.findOne({
			where: { id: id },
			relations: ["AcademicYear"],
		});
		if (!term) throw new NotFoundException(`Term ${id} not found`);
		return term;
	}

	async findCurrent(schoolId: string): Promise<Term> {
		const term = await this.termRepo.findOne({
			where: { isCurrent: true, academicYear: { schoolId } },
			relations: ["AcademicYear", "AcademicYear.School"],
		});
		if (!term) throw new NotFoundException("No current term is set");
		return term;
	}

	async create(schoolId: string, dto: CreateTermDto): Promise<Term> {
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
		return this.termRepo.save(term);
	}

	async update(id: string, dto: UpdateTermDto): Promise<Term> {
		const term = await this.findOne(id);
		if (dto.isCurrent) await this.clearCurrent();
		Object.assign(term, dto);
		return this.termRepo.save(term);
	}

	async setCurrent(id: string): Promise<Term> {
		const term = await this.findOne(id);
		await this.clearCurrent();
		term.isCurrent = true;
		return this.termRepo.save(term);
	}

	async remove(id: string): Promise<void> {
		const term = await this.findOne(id);
		if (term.isCurrent)
			throw new ConflictException("Cannot delete the current term");
		await this.termRepo.remove(term);
	}

	private async clearCurrent(): Promise<void> {
		await this.termRepo.update({ isCurrent: true }, { isCurrent: false });
	}
}
