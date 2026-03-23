import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { School } from "../models/school.entity";
import { CreateStudentDto, UpdateStudentDto } from "../models/student.dto";
import { Student } from "../models/student.entity";

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
			where: { school: { id: schoolId } },
			order: { lastName: "ASC", firstName: "ASC" },
		});
	}

	async findOne(id: string): Promise<Student> {
		const student = await this.studentRepo.findOne({
			where: { id: id },
			relations: ["school", "enrollments", "enrollments.stream", "enrollments.stream.gradeLevel", "enrollments.academicYear", "enrollments.term"],
		});
		if (!student) throw new NotFoundException(`Student ${id} not found`);
		return student;
	}

	async findByAdmissionNumber(admissionNumber: string): Promise<Student> {
		const student = await this.studentRepo.findOne({
			where: { admissionNumber: admissionNumber },
			relations: ["school"],
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
			where: { id: dto.schoolId },
		});
		if (!school)
			throw new NotFoundException(`School ${dto.schoolId} not found`);

		const duplicate = await this.studentRepo.findOne({
			where: { admissionNumber: dto.admissionNumber },
		});
		if (duplicate)
			throw new ConflictException(
				`Admission number ${dto.admissionNumber} already exists`,
			);

		const student = this.studentRepo.create({ school: school, ...dto });
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
		student.status = "inactive";
		await this.studentRepo.save(student);
	}
}
