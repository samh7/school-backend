export interface IEnvironmentVariables {
	DATABASE_URL: string;
	NODE_ENV: "development" | "production" | "test";
	PORT: number;
	JWT_ACCESS_TOKEN_SECRET: string;
	JWT_EXPIRES_IN: string;
	REDIS_HOST: string;
	REDIS_PORT: number;
	REDIS_PASSWORD: string;
	REDIS_DB: number;
	FRONTEND_URL: string;
}
