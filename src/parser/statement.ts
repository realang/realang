import { Parser } from ".";
import { ExpressionStatement, Statement } from "../types/";
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

  parser.expect("EOL");

  const statement: ExpressionStatement = {
    type: "Expression",
    expression: expr,
  };

  return statement;
};
