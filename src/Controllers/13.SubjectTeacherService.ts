import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm/browser/repository/Repository.js";
import { SubjectTeacher } from "../Models/9.SubjectTeacherEntity";

@Injectable()
export class SubjectTeacherService {
	constructor(
		@InjectRepository(SubjectTeacher)
		private readonly subjectTeacherRepository: Repository<SubjectTeacher>
	) { }

	async findAll(schoolId: string): Promise<SubjectTeacher[]> {
		return this.subjectTeacherRepository.find({
			where: { AcademicYear: { School: { Id: schoolId } } },
			relations: ['Staff', 'Subject', 'AcademicYear'],
			order: { CreatedAt: 'DESC' },
		});
	}

	async findOne(id: string): Promise<SubjectTeacher> {
		const teacher = await this.subjectTeacherRepository.findOne({
			where: { Id: id },
			relations: ['Staff', 'Subject', 'AcademicYear'],
		});
		if (!teacher) {
			throw new Error("Subject teacher not found");
		}
		return teacher;
	}

	async findByGradeSubject(gradeSubjectId: string): Promise<SubjectTeacher[]> {
		return this.subjectTeacherRepository.find({
			where: { GradeSubject: { Id: gradeSubjectId } },
			relations: ['Staff', 'Subject', 'AcademicYear'],
			order: { CreatedAt: 'DESC' },
		});
	}
}
