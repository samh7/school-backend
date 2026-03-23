import { Project, SyntaxKind } from "ts-morph";

const project = new Project();
project.addSourceFilesAtPaths("src/**/*.ts");

const renames: Array<{ from: string; to: string }> = [];

// Pass 1: rename class properties
project.getSourceFiles().forEach((file) => {
	file.getClasses().forEach((cls) => {
		cls.getProperties().forEach((prop) => {
			const name = prop.getName();
			if (/^[A-Z]/.test(name)) {
				const newName = name.charAt(0).toLowerCase() + name.slice(1);
				renames.push({ from: name, to: newName });
				prop.rename(newName);
			}
		});
	});
});

// Pass 2: rename function/method parameter names (not types)
project.getSourceFiles().forEach((file) => {
	file.getDescendantsOfKind(SyntaxKind.Parameter).forEach((param) => {
		const nameNode = param.getNameNode();
		// skip destructured params
		if (nameNode.getKind() !== SyntaxKind.Identifier) return;
		const name = nameNode.getText();
		if (/^[A-Z]/.test(name)) {
			const newName = name.charAt(0).toLowerCase() + name.slice(1);
			// rename renames all usages of that param within the function scope
			param.rename(newName);
		}
	});
});

// Pass 3: dto property access and object literals across all files
project.getSourceFiles().forEach((file) => {
	file
		.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)
		.forEach((node) => {
			const objectName = node.getExpression().getText();
			const propName = node.getNameNode().getText();

			const isDtoAccess =
				objectName === "dto" ||
				objectName.endsWith("Dto") ||
				objectName.endsWith("dto");

			if (isDtoAccess && /^[A-Z]/.test(propName)) {
				node
					.getNameNode()
					.replaceWithText(
						propName.charAt(0).toLowerCase() + propName.slice(1),
					);
			}
		});

	file.getDescendantsOfKind(SyntaxKind.PropertyAssignment).forEach((node) => {
		const match = renames.find((r) => r.from === node.getNameNode().getText());
		if (match) node.getNameNode().replaceWithText(match.to);
	});

	file.getDescendantsOfKind(SyntaxKind.BindingElement).forEach((node) => {
		const match = renames.find((r) => r.from === node.getNameNode().getText());
		if (match) node.getNameNode().replaceWithText(match.to);
	});

	if (file.getFilePath().endsWith("Entity.ts")) {
		file.getDescendantsOfKind(SyntaxKind.StringLiteral).forEach((str) => {
			const match = renames.find((r) => r.from === str.getLiteralValue());
			if (match) str.setLiteralValue(match.to);
		});
	}
});

project.save();
