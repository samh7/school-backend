import {
	applyDecorators,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	SetMetadata,
	UseGuards,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserAccountDto } from "../../Models/13.UserAccountDto";
import { RoleEnum } from "../../Models/Types/RoleEnum";
import { JwtAuthGuard } from "../JwtGuard";

export const ROLES_KEY = "roles";

/**
 * Attach one or more allowed roles to a controller or route handler.
 * Automatically applies JwtAuthGuard, RolesGuard and ApiBearerAuth.
 *
 * @example
 * @Roles(RoleEnum.SYSTEM_ADMIN)
 * @Roles(RoleEnum.PRINCIPAL, RoleEnum.ADMIN)
 */
export const Roles = (...roles: RoleEnum[]) =>
	applyDecorators(
		SetMetadata(ROLES_KEY, roles),
		UseGuards(JwtAuthGuard, RolesGuard),
		ApiBearerAuth(),
	);

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(ctx: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
			ROLES_KEY,
			[ctx.getHandler(), ctx.getClass()],
		);

		if (!requiredRoles || requiredRoles.length === 0) return true;

		const user: UserAccountDto = ctx
			.switchToHttp()
			.getRequest<Request & { user: UserAccountDto }>().user;

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
