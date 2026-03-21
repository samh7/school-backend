import { applyDecorators, CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserAccount } from "../../Models/13.UserAccountEntity";
import { RoleEnum } from "../../Models/Types/RoleEnum";
import { JwtAuthGuard } from "../JwtGuard";

export const ROLES_KEY = 'roles';

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
	constructor(private readonly reflector: Reflector) { }

	canActivate(ctx: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
			ctx.getHandler(),
			ctx.getClass(),
		]);

		if (!requiredRoles || requiredRoles.length === 0) return true;

		const user: UserAccount = ctx.switchToHttp().getRequest().user;

		if (!user) {
			throw new ForbiddenException('No authenticated user found on request');
		}

		if (user.Role === RoleEnum.SYSTEM_ADMIN) return true;

		if (!requiredRoles.includes(user.Role as RoleEnum)) {
			throw new ForbiddenException(
				`Access denied — required: ${requiredRoles.join(' | ')}, your role: ${user.Role}`,
			);
		}

		return true;
	}
}
