import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GradeLevel } from "../Models/4.GradeLevelEntity";
import { Subject } from "../Models/6.SubjectEntity";
import { CreateGradeSubjectDto, UpdateGradeSubjectDto } from "../Models/8.GradeSubjectDto";
import { GradeSubject } from "../Models/8.GradeSubjectEntity";
@Injectable()
export class GradeSubjectService {
	constructor(
		@InjectRepository(GradeSubject)
		private readonly gradeSubjectRepo: Repository<GradeSubject>,
		@InjectRepository(GradeLevel)
		private readonly gradeLevelRepo: Repository<GradeLevel>,
		@InjectRepository(Subject)
		private readonly subjectRepo: Repository<Subject>,
	) { }

	async findAll(gradeLevelId: string): Promise<GradeSubject[]> {
		return this.gradeSubjectRepo.find({
			where: { GradeLevel: { Id: gradeLevelId } },
			relations: ['Subject', 'GradeLevel'],
		});
	}

	async findOne(id: string): Promise<GradeSubject> {
		const gs = await this.gradeSubjectRepo.findOne({
			where: { Id: id },
			relations: [
				'GradeLevel',
				'Subject',
				'SubjectTeachers',
				'SubjectTeachers.Staff',
				'SubjectTeachers.Stream',
			],
		});
		if (!gs) throw new NotFoundException(`Grade subject ${id} not found`);
		return gs;
	}


	async create(dto: CreateGradeSubjectDto): Promise<GradeSubject> {
		const gradeLevel = await this.gradeLevelRepo.findOne({ where: { Id: dto.GradeLevelId } });
		if (!gradeLevel) throw new NotFoundException(`Grade level ${dto.GradeLevelId} not found`);

		const subject = await this.subjectRepo.findOne({ where: { Id: dto.SubjectId } });
		if (!subject) throw new NotFoundException(`Subject ${dto.SubjectId} not found`);

		const existing = await this.gradeSubjectRepo.findOne({
			where: { GradeLevel: { Id: dto.GradeLevelId }, Subject: { Id: dto.SubjectId } },
		});
		if (existing) throw new ConflictException(`This subject is already assigned to this grade level`);

		const gs = this.gradeSubjectRepo.create({
			IsExaminable: dto.IsExaminable,
			PeriodsPerWeek: dto.PeriodsPerWeek,
			GradeLevel: gradeLevel,
			Subject: subject,
		});
		return this.gradeSubjectRepo.save(gs);
	}

	async update(id: string, dto: UpdateGradeSubjectDto): Promise<GradeSubject> {
		const gs = await this.findOne(id);
		Object.assign(gs, dto);
		return this.gradeSubjectRepo.save(gs);
	}

	async remove(id: string): Promise<void> {
		const gs = await this.findOne(id);
		await this.gradeSubjectRepo.remove(gs);
	}
}
