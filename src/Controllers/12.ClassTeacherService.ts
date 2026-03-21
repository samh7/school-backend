import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClassTeacher } from "../Models/10.ClassTeacherEntity";

@Injectable()
export class ClassTeacherService {
	constructor(
		@InjectRepository(ClassTeacher)
		private readonly classTeacherRepo: Repository<ClassTeacher>,
	) { }

	async findAll(schoolId: string): Promise<ClassTeacher[]> {
		return this.classTeacherRepo.find({
			where: { AcademicYear: { School: { Id: schoolId } } },
			relations: ['Staff', 'Stream', 'AcademicYear'],
			order: { CreatedAt: 'DESC' },
		});
	}

	async findOne(id: string): Promise<ClassTeacher> {
		const teacher = await this.classTeacherRepo.findOne({
			where: { Id: id },
			relations: ['Staff', 'Stream', 'AcademicYear'],
		});
		if (!teacher) throw new NotFoundException(`Class teacher ${id} not found`);
		return teacher;
	}

	async findByStream(streamId: string): Promise<ClassTeacher[]> {
		return this.classTeacherRepo.find({
			where: { Stream: { Id: streamId } },
			relations: ['Staff', 'Stream', 'AcademicYear'],
			order: { CreatedAt: 'DESC' },
		});
	}
}
