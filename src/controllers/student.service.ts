import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import { School } from "../models/school.entity";
import {
	CreateStudentDto,
	StudentDto,
	UpdateStudentDto,
} from "../models/student.dto";
import { Student } from "../models/student.entity";

@Injectable()
export class StudentService {
	constructor(
		@InjectRepository(Student)
		private readonly studentRepo: Repository<Student>,
		@InjectRepository(School)
		private readonly schoolRepo: Repository<School>,
	) {}

	async findAll(schoolId: string): Promise<StudentDto[]> {
		return plainToInstance(
			StudentDto,
			await this.studentRepo.find({
				where: { school: { id: schoolId } },
				order: { lastName: "ASC", firstName: "ASC" },
			}),
			{ excludeExtraneousValues: true },
		);
	}

	async findOne(id: string): Promise<StudentDto> {
		const student = await this.studentRepo.findOne({
			where: { id },
			relations: [
				"school",
				"enrollments",
				"enrollments.stream",
				"enrollments.stream.gradeLevel",
				"enrollments.academicYear",
				"enrollments.term",
			],
		});
		if (!student) throw new NotFoundException(`Student ${id} not found`);
		return plainToInstance(StudentDto, student, {
			excludeExtraneousValues: true,
		});
	}

	async findByAdmissionNumber(admissionNumber: string): Promise<StudentDto> {
		const student = await this.studentRepo.findOne({
			where: { admissionNumber },
			relations: ["school"],
		});
		if (!student)
			throw new NotFoundException(
				`Admission number ${admissionNumber} not found`,
			);
		return plainToInstance(StudentDto, student, {
			excludeExtraneousValues: true,
		});
	}

	async findByStream(streamId: string, termId: string): Promise<StudentDto[]> {
		const students = await this.studentRepo
			.createQueryBuilder("student")
			.innerJoin("student.Enrollments", "enrollment")
			.where("enrollment.Stream.Id = :streamId", { streamId })
			.andWhere("enrollment.Term.Id = :termId", { termId })
			.andWhere("enrollment.Status = :status", { status: "active" })
			.orderBy("student.LastName", "ASC")
			.getMany();

		return plainToInstance(StudentDto, students, {
			excludeExtraneousValues: true,
		});
	}

	async create(dto: CreateStudentDto): Promise<StudentDto> {
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
		return plainToInstance(StudentDto, await this.studentRepo.save(student), {
			excludeExtraneousValues: true,
		});
	}

	async update(id: string, dto: UpdateStudentDto): Promise<StudentDto> {
		const student = await this.studentRepo.findOne({
			where: { id },
			relations: [
				"school",
				"enrollments",
				"enrollments.stream",
				"enrollments.stream.gradeLevel",
				"enrollments.academicYear",
				"enrollments.term",
			],
		});
		if (!student) throw new NotFoundException(`Student ${id} not found`);
		Object.assign(student, dto);
		return plainToInstance(StudentDto, await this.studentRepo.save(student), {
			excludeExtraneousValues: true,
		});
	}

	async remove(id: string): Promise<void> {
		const student = await this.studentRepo.findOne({ where: { id } });
		if (!student) throw new NotFoundException(`Student ${id} not found`);
		student.status = "inactive";
		await this.studentRepo.save(student);
	}
}
