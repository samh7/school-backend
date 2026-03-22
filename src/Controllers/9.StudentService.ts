import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { School } from "../Models/1.SchoolEntity";
import { CreateStudentDto, UpdateStudentDto } from "../Models/11.StudentDto";
import { Student } from "../Models/11.StudentEntity";

@Injectable()
export class StudentService {
	constructor(
		@InjectRepository(Student)
		private readonly studentRepo: Repository<Student>,
		@InjectRepository(School)
		private readonly schoolRepo: Repository<School>,
	) {}

	async findAll(schoolId: string): Promise<Student[]> {
		return this.studentRepo.find({
			where: { School: { Id: schoolId } },
			order: { LastName: "ASC", FirstName: "ASC" },
		});
	}

	async findOne(id: string): Promise<Student> {
		const student = await this.studentRepo.findOne({
			where: { Id: id },
			relations: [
				"School",
				"Enrollments",
				"Enrollments.Stream",
				"Enrollments.Stream.GradeLevel",
				"Enrollments.AcademicYear",
				"Enrollments.Term",
			],
		});
		if (!student) throw new NotFoundException(`Student ${id} not found`);
		return student;
	}

	async findByAdmissionNumber(admissionNumber: string): Promise<Student> {
		const student = await this.studentRepo.findOne({
			where: { AdmissionNumber: admissionNumber },
			relations: ["School"],
		});
		if (!student)
			throw new NotFoundException(
				`Admission number ${admissionNumber} not found`,
			);
		return student;
	}

	async findByStream(streamId: string, termId: string): Promise<Student[]> {
		return this.studentRepo
			.createQueryBuilder("student")
			.innerJoin("student.Enrollments", "enrollment")
			.where("enrollment.Stream.Id = :streamId", { streamId })
			.andWhere("enrollment.Term.Id = :termId", { termId })
			.andWhere("enrollment.Status = :status", { status: "active" })
			.orderBy("student.LastName", "ASC")
			.getMany();
	}

	async create(dto: CreateStudentDto): Promise<Student> {
		const school = await this.schoolRepo.findOne({
			where: { Id: dto.SchoolId },
		});
		if (!school)
			throw new NotFoundException(`School ${dto.SchoolId} not found`);

		const duplicate = await this.studentRepo.findOne({
			where: { AdmissionNumber: dto.AdmissionNumber },
		});
		if (duplicate)
			throw new ConflictException(
				`Admission number ${dto.AdmissionNumber} already exists`,
			);

		const student = this.studentRepo.create({ School: school, ...dto });
		return this.studentRepo.save(student);
	}

	async update(id: string, dto: UpdateStudentDto): Promise<Student> {
		const student = await this.findOne(id);
		Object.assign(student, dto);
		return this.studentRepo.save(student);
	}

	async remove(id: string): Promise<void> {
		// Soft delete — NEMIS records must be retained
		const student = await this.findOne(id);
		student.Status = "inactive";
		await this.studentRepo.save(student);
	}
}
