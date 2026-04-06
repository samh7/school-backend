import { execSync } from "child_process";
import * as dotenv from "dotenv";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const envPath = join(process.cwd(), ".env");
const examplePath = join(process.cwd(), ".env.example");

if (!existsSync(envPath)) {
	console.error(".env file not found");
	process.exit(1);
}

try {
	const envContent = readFileSync(envPath, "utf8");

	const parsed = dotenv.parse(envContent);

	const exampleContent = Object.keys(parsed)
		.map((key) => `${key}=`)
		.join("\n");

	writeFileSync(examplePath, exampleContent);

	execSync("git add .env.example");

	console.log(".env.example synced and staged");
} catch (error) {
	console.error("Failed to sync .env.example:", error);
	process.exit(1);
}
