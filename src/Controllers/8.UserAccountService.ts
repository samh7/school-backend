import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import { ChangePasswordDto, CreateSystemAdminDto, LoginDto, ResetPasswordDto, UserAccountDto } from "../Models/13.UserAccountDto";
import { UserAccount } from "../Models/13.UserAccountEntity";
import { Staff } from "../Models/7.StaffEntity";
import { RoleEnum } from "../Models/Types/RoleEnum";
@Injectable()
export class UserAccountService {
	constructor(
		@InjectRepository(UserAccount)
		private readonly userAccountRepo: Repository<UserAccount>,
		@InjectRepository(Staff)
		private readonly staffRepo: Repository<Staff>,
	) { }

	// AUTH FACING METHODS
	async _login(loginDto: LoginDto) {
		const account = await this.userAccountRepo.findOne({
			where: { Email: loginDto.Email },
		});

		if (!account)
			throw new UnauthorizedException('User Not Authneticated');

		const compareHashes = await bcrypt.compare(
			loginDto.Password,
			account.PasswordHash
		);


		if (!compareHashes) throw new UnauthorizedException('User Not Authneticated');

		account.LastLogin = new Date();
		await this.userAccountRepo.save(account);

		return plainToInstance(UserAccountDto, account);
	}

	// REGULAR METHODS
	async createSystemAdmin(dto: CreateSystemAdminDto): Promise<UserAccountDto> {
		if (dto.Role !== RoleEnum.SYSTEM_ADMIN) throw new ConflictException('Only system admins can be created with this endpoint');
		const existing = await this.userAccountRepo.findOne({ where: { Email: dto.Email } });
		if (existing) throw new ConflictException(`Email ${dto.Email} is already registered`);
		const userAccount = this.userAccountRepo.create({
			Email: dto.Email,
			PasswordHash: await bcrypt.hash(dto.PasswordHash, 10),
		});
		return plainToInstance(UserAccountDto, this.userAccountRepo.save(userAccount));
	}

	async CreateForStaff(staffId: string, role: RoleEnum): Promise<UserAccountDto> {
		const staff = await this.staffRepo.findOneBy({ Id: staffId });
		if (!staff) throw new NotFoundException(`Staff ${staffId} not found`);
		if (staff.UserAccount) throw new ConflictException(`Staff ${staffId} already has a user account`);
		const userAccount = this.userAccountRepo.create({
			Email: staff.Email,
			PasswordHash: await bcrypt.hash(staffId, 10),
		});
		staff.UserAccount = userAccount;
		await this.staffRepo.save(staff);
		return plainToInstance(UserAccountDto, userAccount);

	}

	async findOne(id: string): Promise<UserAccountDto> {
		const account = await this.userAccountRepo.findOne({
			where: { Id: id },
			relations: ['Staff'],
		});
		if (!account) throw new NotFoundException(`User account ${id} not found`);
		return plainToInstance(UserAccountDto, account);
	}

	async findByEmail(email: string): Promise<UserAccountDto> {
		const account = await this.userAccountRepo.findOne({
			where: { Email: email },
			relations: ['Staff', 'Staff.School'],
		});
		if (!account) throw new NotFoundException(`No account found for ${email}`);
		return plainToInstance(UserAccountDto, account);
	}

	async changePassword(id: string, dto: ChangePasswordDto): Promise<void> {
		const account = await this.userAccountRepo.findOneBy({ Id: id });
		if (!account) throw new NotFoundException(`User account ${id} not found`);
		const valid = await bcrypt.compare(dto.CurrentPassword, account.PasswordHash);
		if (!valid) throw new ConflictException('Current password is incorrect');

		account.PasswordHash = await bcrypt.hash(dto.NewPassword, 10);
		await this.userAccountRepo.save(account);
	}

	async resetPassword(dto: ResetPasswordDto): Promise<{ TempPassword: string; }> {
		const staff = await this.staffRepo.findOne({
			where: { Id: dto.StaffId },
			relations: ['UserAccount'],
		});
		if (!staff) throw new NotFoundException(`Staff ${dto.StaffId} not found`);
		if (!staff.UserAccount) throw new NotFoundException(`Staff ${dto.StaffId} has no user account`);

		const tempPassword = `${staff.FirstName.toLowerCase()}@${Math.floor(1000 + Math.random() * 9000)}`;
		staff.UserAccount.PasswordHash = await bcrypt.hash(tempPassword, 10);
		await this.userAccountRepo.save(staff.UserAccount);

		return { TempPassword: tempPassword };
	}

	async toggleActive(id: string): Promise<UserAccount> {
		const account = await this.findOne(id);
		account.IsActive = !account.IsActive;
		return this.userAccountRepo.save(account);
	}
}
