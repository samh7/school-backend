import { Project } from "ts-morph";
import * as path from "path";

const project = new Project({ tsConfigFilePath: "tsconfig.json" });
project.addSourceFilesAtPaths("src/**/*.ts"); // Target your source folder

let renameCount = 0;

console.log("Scanning for files with numeric prefixes...\n");

project.getSourceFiles().forEach((file) => {
	const filePath = file.getFilePath();
	const dir = path.dirname(filePath);
	const fileName = path.basename(filePath);

	// Regex: Looks for 1 or more digits followed by a dot at the start of the string
	if (/^\d+\./.test(fileName)) {
		const newFileName = fileName.replace(/^\d+\./, "");
		const newPath = path.join(dir, newFileName);

		// .move() renames the file AND updates all imports pointing to it
		file.move(newPath);

		console.log(`Renamed and updated imports: ${fileName} → ${newFileName}`);
		renameCount++;
	}
});

if (renameCount > 0) {
	project.saveSync();
	console.log(`\nSuccess! Cleaned up ${renameCount} files.`);
} else {
	console.log("No files with numeric prefixes found.");
}
