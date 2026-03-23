import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClassTeacher } from "../models/class-teacher.entity";

@Injectable()
export class ClassTeacherService {
	constructor(
		@InjectRepository(ClassTeacher)
		private readonly classTeacherRepo: Repository<ClassTeacher>,
	) {}

	async findAll(schoolId: string): Promise<ClassTeacher[]> {
		return this.classTeacherRepo.find({
			where: { academicYear: { school: { id: schoolId } } },
			relations: ["staff", "stream", "academicYear"],
			order: { createdAt: "DESC" },
		});
	}

	async findOne(id: string): Promise<ClassTeacher> {
		const teacher = await this.classTeacherRepo.findOne({
			where: { id: id },
			relations: ["staff", "stream", "academicYear"],
		});
		if (!teacher) throw new NotFoundException(`Class teacher ${id} not found`);
		return teacher;
	}

	async findByStream(streamId: string): Promise<ClassTeacher[]> {
		return this.classTeacherRepo.find({
			where: { stream: { id: streamId } },
			relations: ["staff", "stream", "academicYear"],
			order: { createdAt: "DESC" },
		});
	}
}
