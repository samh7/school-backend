import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserAccount } from "../../Models/13.UserAccountEntity";
import { RoleEnum } from "../../Models/types/RoleEnum";

export const ROLES_KEY = 'roles';

/**
 * Attach one or more allowed roles to a controller or route handler.
 *
 * @example
 * // Single role
 * @Roles(RoleEnum.SYSTEM_ADMIN)
 *
 * // Multiple roles
 * @Roles(RoleEnum.PRINCIPAL, RoleEnum.ADMIN)
 *
 * // On a whole controller — every route inside inherits this
 * @Roles(RoleEnum.SYSTEM_ADMIN)
 * @Controller('system-admin')
 * export class SystemAdminController {}
 *
 * // Route-level override — more specific than controller-level
 * @Roles(RoleEnum.PRINCIPAL, RoleEnum.HOD)
 * @Get('grade-subjects')
 * findGradeSubjects() {}
 */
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);

// ─────────────────────────────────────────────
// ROLES GUARD
// ─────────────────────────────────────────────

/**
 * Enforces role-based access control.
 *
 * Reads the roles attached by @Roles() and compares against
 * the current user's Role from the JWT-populated request.user.
 *
 * Route-level @Roles() takes priority over controller-level @Roles().
 * If no @Roles() is attached at all, the route is considered open
 * (guard passes). Pair with JwtAuthGuard to also require authentication.
 *
 * Register globally in AppModule or apply per-controller with @UseGuards().
 */
@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) { }

	canActivate(ctx: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
			ctx.getHandler(),
			ctx.getClass(),
		]);

		// No @Roles() attached — route is unrestricted by this guard
		if (!requiredRoles || requiredRoles.length === 0) return true;

		const user: UserAccount = ctx.switchToHttp().getRequest().user;

		if (!user) {
			throw new ForbiddenException('No authenticated user found on request');
		}

		if (!requiredRoles.includes(user.Role as RoleEnum)) {
			throw new ForbiddenException(
				`Access denied — required: ${requiredRoles.join(' | ')}, your role: ${user.Role}`,
			);
		}

		return true;
	}
}
