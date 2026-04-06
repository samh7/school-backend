import { SetMetadata } from "@nestjs/common";
import { RoleEnum } from "../../models/types/role-enum";
export const ROLES_KEY = "roles";

/** @example @Roles(RoleEnum.PRINCIPAL, RoleEnum.ADMIN) */
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
