import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import { ClassTeacherDto } from "../models/class-teacher.dto";
import { ClassTeacher } from "../models/class-teacher.entity";

@Injectable()
export class ClassTeacherService {
	constructor(
		@InjectRepository(ClassTeacher)
		private readonly classTeacherRepo: Repository<ClassTeacher>,
	) {}

	async findAll(schoolId: string): Promise<ClassTeacherDto[]> {
		const teachers = await this.classTeacherRepo.find({
			where: { academicYear: { school: { id: schoolId } } },
			relations: ["staff", "stream", "academicYear"],
			order: { createdAt: "DESC" },
		});
		return plainToInstance(ClassTeacherDto, teachers, {
			excludeExtraneousValues: true,
		});
	}

	async findOne(id: string): Promise<ClassTeacherDto> {
		const teacher = await this.classTeacherRepo.findOne({
			where: { id: id },
			relations: ["staff", "stream", "academicYear"],
		});
		if (!teacher) throw new NotFoundException(`Class teacher ${id} not found`);

		return plainToInstance(ClassTeacherDto, teacher, {
			excludeExtraneousValues: true,
		});
	}

	async findByStream(streamId: string): Promise<ClassTeacherDto[]> {
		const teacher = await this.classTeacherRepo.find({
			where: { stream: { id: streamId } },
			relations: ["staff", "stream", "academicYear"],
			order: { createdAt: "DESC" },
		});
		return plainToInstance(ClassTeacherDto, teacher, {
			excludeExtraneousValues: true,
		});
	}
}
