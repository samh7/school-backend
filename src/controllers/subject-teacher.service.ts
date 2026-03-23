import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import { SubjectTeacherDto } from "../models/subject-teacher.dto";
import { SubjectTeacher } from "../models/subject-teacher.entity";

@Injectable()
export class SubjectTeacherService {
	constructor(
		@InjectRepository(SubjectTeacher)
		private readonly subjectTeacherRepository: Repository<SubjectTeacher>,
	) {}

	async findAll(schoolId: string): Promise<SubjectTeacherDto[]> {
		const subjectTeachers = await this.subjectTeacherRepository.find({
			where: { academicYear: { school: { id: schoolId } } },
			relations: ["staff", "gradeSubject", "academicYear"],
			order: { createdAt: "DESC" },
		});

		return plainToInstance(SubjectTeacherDto, subjectTeachers, {
			excludeExtraneousValues: true,
		});
	}

	async findOne(id: string): Promise<SubjectTeacherDto> {
		const teacher = await this.subjectTeacherRepository.findOne({
			where: { id: id },
			relations: ["staff", "gradeSubject", "academicYear"],
		});
		if (!teacher) {
			throw new Error("Subject teacher not found");
		}
		return plainToInstance(SubjectTeacherDto, teacher, {
			excludeExtraneousValues: true,
		});
	}

	async findByGradeSubject(gradeSubjectId: string): Promise<SubjectTeacher[]> {
		return this.subjectTeacherRepository.find({
			where: { gradeSubject: { id: gradeSubjectId } },
			relations: ["staff", "gradeSubject", "academicYear"],
			order: { createdAt: "DESC" },
		});
	}
}
