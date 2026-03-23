import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GradeLevel } from "../models/grade-level.entity";
import { Subject } from "../models/subject.entity";
import {
	CreateGradeSubjectDto,
	UpdateGradeSubjectDto,
} from "../models/grade-subject.dto";
import { GradeSubject } from "../models/grade-subject.entity";
@Injectable()
export class GradeSubjectService {
	constructor(
		@InjectRepository(GradeSubject)
		private readonly gradeSubjectRepo: Repository<GradeSubject>,
		@InjectRepository(GradeLevel)
		private readonly gradeLevelRepo: Repository<GradeLevel>,
		@InjectRepository(Subject)
		private readonly subjectRepo: Repository<Subject>,
	) {}

	async findAll(gradeLevelId: string): Promise<GradeSubject[]> {
		return this.gradeSubjectRepo.find({
			where: { gradeLevel: { id: gradeLevelId } },
			relations: ["Subject", "GradeLevel"],
		});
	}

	async findOne(id: string): Promise<GradeSubject> {
		const gs = await this.gradeSubjectRepo.findOne({
			where: { id: id },
			relations: [
				"GradeLevel",
				"Subject",
				"SubjectTeachers",
				"SubjectTeachers.Staff",
				"SubjectTeachers.Stream",
			],
		});
		if (!gs) throw new NotFoundException(`Grade subject ${id} not found`);
		return gs;
	}

	async create(dto: CreateGradeSubjectDto): Promise<GradeSubject> {
		const gradeLevel = await this.gradeLevelRepo.findOne({
			where: { id: dto.gradeLevelId },
		});
		if (!gradeLevel)
			throw new NotFoundException(`Grade level ${dto.gradeLevelId} not found`);

		const subject = await this.subjectRepo.findOne({
			where: { id: dto.subjectId },
		});
		if (!subject)
			throw new NotFoundException(`Subject ${dto.subjectId} not found`);

		const existing = await this.gradeSubjectRepo.findOne({
			where: {
				gradeLevel: { id: dto.gradeLevelId },
				subject: { id: dto.subjectId },
			},
		});
		if (existing)
			throw new ConflictException(
				`This subject is already assigned to this grade level`,
			);

		const gs = this.gradeSubjectRepo.create({
			isExaminable: dto.isExaminable,
			periodsPerWeek: dto.periodsPerWeek,
			gradeLevel: gradeLevel,
			subject: subject,
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
