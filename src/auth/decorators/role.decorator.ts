import { SetMetadata } from "@nestjs/common";
import { RoleEnum } from "../../models/types/role-enum";
import { ROLES_KEY } from "../role.guard";

/** @example @Roles(RoleEnum.PRINCIPAL, RoleEnum.ADMIN) */
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
