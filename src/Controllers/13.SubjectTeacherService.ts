import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SubjectTeacher } from "../Models/9.SubjectTeacherEntity";

@Injectable()
export class SubjectTeacherService {
	constructor(
		@InjectRepository(SubjectTeacher)
		private readonly subjectTeacherRepository: Repository<SubjectTeacher>,
	) {}

	async findAll(schoolId: string): Promise<SubjectTeacher[]> {
		return this.subjectTeacherRepository.find({
			where: { academicYear: { school: { id: schoolId } } },
			relations: ["Staff", "GradeSubject", "AcademicYear"],
			order: { createdAt: "DESC" },
		});
	}

	async findOne(id: string): Promise<SubjectTeacher> {
		const teacher = await this.subjectTeacherRepository.findOne({
			where: { id: id },
			relations: ["Staff", "GradeSubject", "AcademicYear"],
		});
		if (!teacher) {
			throw new Error("Subject teacher not found");
		}
		return teacher;
	}

	async findByGradeSubject(gradeSubjectId: string): Promise<SubjectTeacher[]> {
		return this.subjectTeacherRepository.find({
			where: { gradeSubject: { id: gradeSubjectId } },
			relations: ["Staff", "GradeSubject", "AcademicYear"],
			order: { createdAt: "DESC" },
		});
	}
}
