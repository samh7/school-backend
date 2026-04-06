import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RoleEnum } from "../models/types/role-enum";
import { JwtPayloadDto } from "../models/user-account.dto";
import { ROLES_KEY } from "./decorators/role.decorator";

export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(ctx: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
			ROLES_KEY,
			[ctx.getHandler(), ctx.getClass()],
		);

		if (!requiredRoles || requiredRoles.length === 0) return true;

		const payload: JwtPayloadDto = ctx
			.switchToHttp()
			.getRequest<Request & { user: JwtPayloadDto }>().user;
		const user = payload.user;

		if (!user) {
			throw new ForbiddenException("No authenticated user found on request");
		}

		if (user.role === RoleEnum.SYSTEM_ADMIN) return true;

		if (!requiredRoles.includes(user.role as RoleEnum)) {
			throw new ForbiddenException(
				`Access denied — required: ${requiredRoles.join(" | ")}, your role: ${user.role}`,
			);
		}

		return true;
	}
}
