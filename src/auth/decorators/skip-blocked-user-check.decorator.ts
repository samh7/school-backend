import { SetMetadata } from "@nestjs/common";
import { SKIP_BLOCKED_USER_CHECK } from "../../common/blocked-users";

export const SkipBlockedUserCheck = () =>
	SetMetadata(SKIP_BLOCKED_USER_CHECK, true);
