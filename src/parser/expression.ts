import { BindOptions } from "dgram";
import { Parser } from ".";
import {
  ArrayLiteral,
  BinaryExpression,
  Expression,
  Identifier,
  NumericLiteral,
  PrefixExpression,
  RecordConstructionExpression,
  StringLiteral,
  VariableAssignmentExpression,
  VariableDeclarationExpression,
} from "../types";
import { Type } from "../types/types.types";
import { raise } from "../util";
import {
  BindingPower,
  BindingPowerTable,
  bpLookup,
  ledLookup,
  nudLookup,
} from "./lookups";
import { parseType } from "./types";
import { warn } from "console";

export const parseExpression = (
  parser: Parser,
  bp: BindingPower,
): Expression => {
  const nudHandler = nudLookup.get(parser.currentToken.type);

  if (!nudHandler) {
    raise(
      `:: Internal Error -> No handler found for NUD expression: ${parser.currentToken.value} [${parser.currentToken.type}]`,
    );
    return {} as Expression; // ! Unreachable
  }

  let lhs = nudHandler(parser);

  while (
    bpLookup.get(parser.currentToken.type) ??
    BindingPowerTable.default > bp
  ) {
    const ledHandler = ledLookup.get(parser.currentToken.type);

    if (!ledHandler) {
      raise(
        `:: Internal Error -> No handler found for LED expression: ${parser.advance()}`,
      );
      return {} as Expression; // ! Unreachable
    }

    lhs = ledHandler(
      parser,
      lhs,
      bpLookup.get(parser.currentToken.type) ?? BindingPowerTable.default,
    );
  }

  return lhs;
};

export const parsePrimaryExpression = (parser: Parser): Expression => {
  switch (parser.currentToken.type) {
    case "Number": {
      const num = parseFloat(parser.advance().value);
      const expr: NumericLiteral = {
        type: "NumericLiteral",
        value: num,
      };

      return expr;
    }

    case "String": {
      const expr: StringLiteral = {
        type: "StringLiteral",
        value: parser.advance().value,
      };
      return expr;
    }

    case "Identifier": {
      const expr: Identifier = {
        type: "Identifier",
        value: parser.advance().value,
      };
      return expr;
    }

    default:
      raise(
        `:: Internal Error -> Unknown type for primary expression: ${parser.advance()}`,
      );
      return {} as Expression; // ! This line won't be reached
  }
};

export const parseBinaryExpression = (
  parser: Parser,
  lhs: Expression,
  bp: BindingPower,
): Expression => {
  const operator = parser.advance();

  const rhs = parseExpression(parser, bp);

  const expr: BinaryExpression = {
    type: "BinaryExpression",
    lhs,
    rhs,
    operator,
  };

  return expr;
};

export const parsePrefixExpression = (parser: Parser): Expression => {
  const operator = parser.advance();
  const rhs = parseExpression(parser, BindingPowerTable.default);

  const expr: PrefixExpression = {
    type: "PrefixExpression",
    rhs,
    operator,
  };

  return expr;
};

export const parseVariableDeclarationExpression = (
  parser: Parser,
  lhs: Expression,
  bp: BindingPower,
): Expression => {
  let explicitType: Type | undefined = undefined;
  let value: Expression | undefined = undefined;
  const isConstant = parser.currentToken.type === "Const";

  parser.advance();

  if (parser.currentToken.type !== "ExplicitType") {
    value = parseExpression(parser, bp);
  }

  if (parser.currentToken.type === "ExplicitType") {
    parser.advance();
    explicitType = parseType(parser, BindingPowerTable.default);
  }

  if (isConstant && !value) {
    raise("Cannot declare constant entity without value (are you stupid?)");
  }

  const expr: VariableDeclarationExpression = {
    type: "VariableDeclaration",
    identifier: lhs,
    value,
    explicitType,
    isConstant,
  };

  return expr;
};

export const parseAssignmentExpression = (
  parser: Parser,
  lhs: Expression,
  bp: BindingPower,
): Expression => {
  parser.advance();
  const rhs = parseExpression(parser, bp);

  const expr: VariableAssignmentExpression = {
    type: "VariableAssignment",
    assignee: lhs,
    value: rhs,
  };

  return expr;
};

export const parseGroupingExpression = (parser: Parser) => {
  parser.advance();

  const expr = parseExpression(parser, BindingPowerTable.default);

  parser.expect("CloseParenthesis");

  return expr;
};

export const parseRecordConstruction = (
  parser: Parser,
  lhs: Expression,
  bp: BindingPower,
): Expression => {
  if (!("value" in lhs) || typeof lhs.value !== "string")
    return {} as Expression;
  const name = lhs.value;
  const properties: RecordConstructionExpression["properties"] = new Map();

  parser.expect("OpenBrace");

  while (parser.hasTokens && parser.currentToken.type !== "CloseBrace") {
    const propName = parser.expect("Identifier").value;
    parser.expect("Colon");
    const propValue = parseExpression(parser, BindingPowerTable.assignment);
    properties.set(propName, propValue);
  }

  parser.expect("CloseBrace");

  const expr: RecordConstructionExpression = {
    type: "RecordConstruction",
    name,
    properties,
  };

  return expr;
};

export const parseArrayLiteral = (parser: Parser): Expression => {
  parser.expect("OpenBracket");

  const value = Array<Expression>();

  while (parser.hasTokens && parser.currentToken.type !== "CloseBracket") {
    const prop = parseExpression(parser, BindingPowerTable.assignment);
    value.push(prop);

    // @ts-ignore
    if (parser.currentToken.type !== "CloseBracket") {
      parser.expect("Comma");
    }
  }

  parser.expect("CloseBracket");

  const expr: ArrayLiteral = {
    type: "ArrayLiteral",
    value,
  };

  return expr;
};
