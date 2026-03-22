export interface EnvironmentVariables {
	DATABASE_URL: string;
	NODE_ENV: "development" | "production" | "test";
	PORT: number;
	JWT_ACCESS_TOKEN_SECRET: string;
	JWT_EXPIRES_IN: string;
}
