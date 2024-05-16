import { Parser } from ".";
import { TokenType } from "../lib/tokens";
import {
  ExpressionStatement,
  RecordDeclarationStatement,
  Statement,
} from "../types/";
import { Type } from "../types/types.types";
import { raise } from "../util";
import { parseExpression } from "./expression";
import { BindingPower, statementLookup } from "./lookups";
import { parseType } from "./types";

export const parseStatement = (parser: Parser): Statement => {
  const statementHandler = statementLookup.get(parser.currentToken.type);

  if (statementHandler) {
    return statementHandler(parser);
  }

  return parseExpressionStatement(parser);
};

export const parseExpressionStatement = (parser: Parser): Statement => {
  const expr = parseExpression(parser, BindingPower.default);

  parser.expect(TokenType.EOL);

  const statement: ExpressionStatement = {
    type: "Expression",
    expression: expr,
  };

  return statement;
};

export const parseRecordDeclarationStatement = (parser: Parser): Statement => {
  parser.expect(TokenType.Record);

  const name = parser.expect(TokenType.Identifier);

  parser.expect(TokenType.OpenBrace);

  const properties: RecordDeclarationStatement["properties"] = new Map();

  while (
    parser.hasTokens &&
    parser.currentToken.type !== TokenType.CloseBrace
  ) {
    let propName: string | null = null;
    let propType: Type | null = null;

    if (parser.currentToken.type === TokenType.Identifier) {
      propName = parser.expect(TokenType.Identifier).value;

      parser.expect(TokenType.Colon);

      propType = parseType(parser, BindingPower.default);

      parser.expect(TokenType.EOL);

      if (properties.has(propName)) {
        raise(
          `[Trace: ${parser.trace.line}:${parser.trace.pos}] Property name must be unique`,
        );
      }

      properties.set(propName, propType);
    }
  }

  parser.expect(TokenType.CloseBrace);

  const statement: RecordDeclarationStatement = {
    type: "RecordDeclaration",
    name,
    properties,
  };

  return statement;
};
