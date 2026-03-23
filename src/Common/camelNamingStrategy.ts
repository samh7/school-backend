import { DefaultNamingStrategy, NamingStrategyInterface } from "typeorm";

export class CamelNamingStrategy
	extends DefaultNamingStrategy
	implements NamingStrategyInterface
{
	columnName(propertyName: string): string {
		return propertyName;
	}

	tableName(className: string): string {
		return className.charAt(0).toLowerCase() + className.slice(1);
	}
}
