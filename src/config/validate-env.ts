import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { EnvVariables } from "./env-types";

export function validateEnv(config: Record<string, unknown>) {
	const instance = plainToInstance(EnvVariables, config, {
		enableImplicitConversion: true,
	});

	const errors = validateSync(instance, {
		skipMissingProperties: false,
	});

	if (errors.length > 0) {
		const formatted = errors
			.map(
				(err) =>
					`${err.property}: ${Object.values(err.constraints || {}).join(", ")}`,
			)
			.join("\n");

		throw new Error(`Invalid environment variables:\n${formatted}`);
	}

	return instance;
}
