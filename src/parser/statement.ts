import { Parser } from ".";
import {
  ExpressionStatement,
  Statement,
  VariableDeclarationStatement,
} from "../types/";
import { parseExpression } from "./expression";
import { BindingPowerTable, statementLookup } from "./lookups";

export const parseStatement = (parser: Parser): Statement => {
  const statementHandler = statementLookup.get(parser.currentToken.type);

  if (statementHandler) {
    return statementHandler(parser);
  }

  return parseExpressionStatement(parser);
};

export const parseExpressionStatement = (parser: Parser): Statement => {
  const expr = parseExpression(parser, BindingPowerTable.default);

  if (
    parser.currentToken.type === "Const" ||
    parser.currentToken.type === "Let"
  ) {
    return parseVariableDeclarationStatement(parser);
  }

  parser.expect("EOL");

  const statement: ExpressionStatement = {
    type: "Expression",
    expression: expr,
  };

  return statement;
};

export const parseVariableDeclarationStatement = (
  parser: Parser,
): Statement => {
  const isConstant = parser.currentToken.type === "Const";

  parser.recede();

  const identifier = parser.expect("Identifier");

  parser.advance();

  const value = parseExpression(parser, BindingPowerTable.assignment);

  parser.expect("EOL");

  const statement: VariableDeclarationStatement = {
    type: "VariableDeclaration",
    identifier,
    value,
    isConstant,
  };

  return statement;
};
