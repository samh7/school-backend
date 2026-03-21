import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AcademicYear } from "../Models/2.AcademicYearEntity";
import { CreateTermDto, UpdateTermDto } from "../Models/3.TermDto";
import { Term } from "../Models/3.TermEntity";

@Injectable()
export class TermService {
	constructor(
		@InjectRepository(Term)
		private readonly termRepo: Repository<Term>,
		@InjectRepository(AcademicYear)
		private readonly academicYearRepo: Repository<AcademicYear>,
	) { }

	async findAll(academicYearId: string): Promise<Term[]> {
		return this.termRepo.find({
			where: { AcademicYear: { Id: academicYearId } },
			order: { TermNumber: 'ASC' },
		});
	}

	async findOne(id: string): Promise<Term> {
		const term = await this.termRepo.findOne({
			where: { Id: id },
			relations: ['AcademicYear'],
		});
		if (!term) throw new NotFoundException(`Term ${id} not found`);
		return term;
	}

	async findCurrent(SchoolId: string): Promise<Term> {
		const term = await this.termRepo.findOne({
			where: { IsCurrent: true, AcademicYear: { SchoolId } },
			relations: ['AcademicYear', 'AcademicYear.School'],
		});
		if (!term) throw new NotFoundException('No current term is set');
		return term;
	}

	async create(SchoolId: string, dto: CreateTermDto): Promise<Term> {
		const academicYear = await this.academicYearRepo.findOne({ where: { Id: dto.AcademicYearId, SchoolId } });
		if (!academicYear) throw new NotFoundException(`Academic year ${dto.AcademicYearId} not found`);

		const duplicate = await this.termRepo.findOne({
			where: { AcademicYear: { Id: dto.AcademicYearId, SchoolId }, TermNumber: dto.TermNumber },
		});
		if (duplicate) throw new ConflictException(`Term ${dto.TermNumber} already exists for this academic year`);

		if (dto.IsCurrent) await this.clearCurrent();

		const term = this.termRepo.create({
			TermNumber: dto.TermNumber,
			StartDate: dto.StartDate,
			EndDate: dto.EndDate,
			IsCurrent: dto.IsCurrent ?? false,
			AcademicYear: academicYear,
		});
		return this.termRepo.save(term);
	}

	async update(id: string, dto: UpdateTermDto): Promise<Term> {
		const term = await this.findOne(id);
		if (dto.IsCurrent) await this.clearCurrent();
		Object.assign(term, dto);
		return this.termRepo.save(term);
	}

	async setCurrent(id: string): Promise<Term> {
		const term = await this.findOne(id);
		await this.clearCurrent();
		term.IsCurrent = true;
		return this.termRepo.save(term);
	}

	async remove(id: string): Promise<void> {
		const term = await this.findOne(id);
		if (term.IsCurrent) throw new ConflictException('Cannot delete the current term');
		await this.termRepo.remove(term);
	}

	private async clearCurrent(): Promise<void> {
		await this.termRepo.update({ IsCurrent: true }, { IsCurrent: false });
	}
}
