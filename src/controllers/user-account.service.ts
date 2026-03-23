import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import { Staff } from "../models/staff.entity";
import { RoleEnum } from "../models/types/role-enum";
import {
	ChangePasswordDto,
	CreateSystemAdminDto,
	LoginDto,
	ResetPasswordDto,
	UserAccountDto,
} from "../models/user-account.dto";
import { UserAccount } from "../models/user-account.entity";
@Injectable()
export class UserAccountService {
	constructor(
		@InjectRepository(UserAccount)
		private readonly userAccountRepo: Repository<UserAccount>,
		@InjectRepository(Staff)
		private readonly staffRepo: Repository<Staff>,
	) {}

	// AUTH FACING METHODS
	async _login(loginDto: LoginDto) {
		const account = await this.userAccountRepo.findOne({
			where: { email: loginDto.email },
		});

		if (!account) throw new UnauthorizedException("User Not Authneticated");

		const compareHashes = await bcrypt.compare(
			loginDto.password,
			account.passwordHash,
		);

		if (!compareHashes)
			throw new UnauthorizedException("User Not Authneticated");

		account.lastLogin = new Date();
		await this.userAccountRepo.save(account);

		return plainToInstance(UserAccountDto, account, {
			excludeExtraneousValues: true,
		});
	}

	async _updatePassword(userId: string, newPasswordHash: string) {
		await this.userAccountRepo.update(
			{ id: userId },
			{ passwordHash: newPasswordHash },
		);
	}

	// REGULAR METHODS
	async createSystemAdmin(dto: CreateSystemAdminDto): Promise<UserAccountDto> {
		if (dto.role !== RoleEnum.SYSTEM_ADMIN)
			throw new ConflictException(
				"Only system admins can be created with this endpoint",
			);
		const existing = await this.userAccountRepo.findOne({
			where: { email: dto.email },
		});
		if (existing)
			throw new ConflictException(`Email ${dto.email} is already registered`);
		const userAccount = this.userAccountRepo.create({
			...dto,
			passwordHash: await bcrypt.hash(dto.password, 10),
		});
		const account = await this.userAccountRepo.save(userAccount);
		return plainToInstance(UserAccountDto, account, {
			excludeExtraneousValues: true,
		});
	}

	async CreateForStaff(
		staffId: string,
		role: RoleEnum,
	): Promise<UserAccountDto> {
		const staff = await this.staffRepo.findOneBy({ id: staffId });
		if (!staff) throw new NotFoundException(`Staff ${staffId} not found`);
		if (staff.userAccount)
			throw new ConflictException(
				`Staff ${staffId} already has a user account`,
			);
		const userAccount = this.userAccountRepo.create({
			email: staff.email,
			passwordHash: await bcrypt.hash(staffId, 10),
			role: role,
		});
		staff.userAccount = userAccount;
		await this.staffRepo.save(staff);
		return plainToInstance(UserAccountDto, userAccount, {
			excludeExtraneousValues: true,
		});
	}

	async findOne(id: string): Promise<UserAccountDto> {
		const account = await this.userAccountRepo.findOne({
			where: { id: id },
			relations: ["staff"],
		});
		if (!account) throw new NotFoundException(`User account ${id} not found`);
		return plainToInstance(UserAccountDto, account, {
			excludeExtraneousValues: true,
		});
	}

	async findByEmail(email: string): Promise<UserAccountDto> {
		const account = await this.userAccountRepo.findOne({
			where: { email: email },
			relations: ["staff", "staff.school"],
		});
		if (!account) throw new NotFoundException(`No account found for ${email}`);
		return plainToInstance(UserAccountDto, account, {
			excludeExtraneousValues: true,
		});
	}

	async changePassword(id: string, dto: ChangePasswordDto): Promise<void> {
		const account = await this.userAccountRepo.findOneBy({ id: id });
		if (!account) throw new NotFoundException(`User account ${id} not found`);
		const valid = await bcrypt.compare(
			dto.currentPassword,
			account.passwordHash,
		);
		if (!valid) throw new ConflictException("Current password is incorrect");

		account.passwordHash = await bcrypt.hash(dto.newPassword, 10);
		await this.userAccountRepo.save(account);
	}

	async resetPassword(
		dto: ResetPasswordDto,
	): Promise<{ TempPassword: string }> {
		const staff = await this.staffRepo.findOne({
			where: { id: dto.staffId },
			relations: ["userAccount"],
		});
		if (!staff) throw new NotFoundException(`Staff ${dto.staffId} not found`);
		if (!staff.userAccount)
			throw new NotFoundException(`Staff ${dto.staffId} has no user account`);

		const tempPassword = `${staff.firstName.toLowerCase()}@${Math.floor(1000 + Math.random() * 9000)}`;
		staff.userAccount.passwordHash = await bcrypt.hash(tempPassword, 10);
		await this.userAccountRepo.save(staff.userAccount);

		return { TempPassword: tempPassword };
	}

	async toggleActive(id: string): Promise<UserAccountDto> {
		const account = await this.findOne(id);
		account.isActive = !account.isActive;
		const userAccount = await this.userAccountRepo.save(account);
		return plainToInstance(UserAccountDto, userAccount, {
			excludeExtraneousValues: true,
		});
	}
}
