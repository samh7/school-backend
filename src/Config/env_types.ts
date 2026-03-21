export interface EnvironmentVariables {
	DATABASE_URL: string;
	NODE_ENV: 'development' | 'production' | 'test';
	PORT: number;
}
