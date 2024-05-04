import { Parser } from ".";
import {
  ExpressionStatement,
  RecordDeclarationStatement,
  Statement,
} from "../types/";
import { Type } from "../types/types.types";
import { raise } from "../util";
import { parseExpression } from "./expression";
import { BindingPowerTable, statementLookup } from "./lookups";
import { parseType } from "./types";

export const parseStatement = (parser: Parser): Statement => {
  const statementHandler = statementLookup.get(parser.currentToken.type);

  if (statementHandler) {
    return statementHandler(parser);
  }

  return parseExpressionStatement(parser);
};

export const parseExpressionStatement = (parser: Parser): Statement => {
  const expr = parseExpression(parser, BindingPowerTable.default);

  parser.expect("EOL");

  const statement: ExpressionStatement = {
    type: "Expression",
    expression: expr,
  };

  return statement;
};

export const parseRecordDeclarationStatement = (parser: Parser): Statement => {
  parser.expect("Record");

  const name = parser.expect("Identifier");

  parser.expect("OpenBrace");

  const properties: RecordDeclarationStatement["properties"] = new Map();

  while (parser.hasTokens && parser.currentToken.type !== "CloseBrace") {
    let propName: string | null = null;
    let propType: Type | null = null;

    if (parser.currentToken.type === "Identifier") {
      propName = parser.expect("Identifier").value;

      parser.expect("Colon");

      propType = parseType(parser, BindingPowerTable.default);

      parser.expect("EOL");

      if (properties.has(propName)) {
        raise(
          `[Trace: ${parser.trace.line}:${parser.trace.pos}] Property name must be unique`,
        );
      }

      properties.set(propName, propType);
    }
  }

  parser.expect("CloseBrace");

  const statement: RecordDeclarationStatement = {
    type: "RecordDeclaration",
    name,
    properties,
  };

  return statement;
};
