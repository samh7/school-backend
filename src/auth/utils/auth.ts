import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { SALT_ROUNDS } from "../../common/CONSTANTS";
import { JwtPayloadDto, UserAccountDto } from "../../models/user-account.dto";

export function createPayload(account: UserAccountDto, generation: number) {
	const basePayload = {
		jti: uuidv4(),
		sub: account.id,
		generation,
	};
	if (account.staff) {
		if (!account.staff.schoolId)
			throw new Error("School Staff must have a schoolId");

		const payload: Omit<JwtPayloadDto, "exp"> = {
			...basePayload,
			user: {
				email: account.email,
				id: account.id,
				role: account.role,
				staffId: account.staffId,
				isActive: account.isActive,
				lastLogin: account.lastLogin,
				schoolId: account.staff.schoolId,
			},
		};

		return payload;
	} else {
		const payload: Omit<JwtPayloadDto, "exp" | "user"> & {
			user: Omit<UserAccountDto, "schoolId">;
		} = {
			...basePayload,
			user: {
				email: account.email,
				id: account.id,
				role: account.role,
				staffId: account.staffId,
				isActive: account.isActive,
				lastLogin: account.lastLogin,
			},
		};

		return payload;
	}
}

export async function hashPassword(password: string) {
	const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
	return passwordHash;
}

export async function comparePasswordHashes(
	password: string,
	encryptedPassword: string,
) {
	const isMatch = await bcrypt.compare(password, encryptedPassword);
	return isMatch;
}
