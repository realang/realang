import { Parser } from ".";
import { TokenType } from "../lib/tokens";
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
import { FunctionCallExpression, FunctionDeclarationExpr, Statement, raise } from "../util";
import {
  BindingPower,
  bpLookup,
  ledLookup,
  nudLookup,
} from "./lookups";
import { parseStatement } from "./statement";
import { parseType } from "./types";

export const parseExpression = (parser: Parser, bp: BindingPower): Expression => {
  const nudHandler = nudLookup.get(parser.currentToken.type);

  if (!nudHandler) {
    raise(
      `:: Internal Error -> No handler found for NUD expression: ${parser.currentToken.value} [${parser.currentToken.type}]`
    );
    return {} as Expression; // ! Unreachable
  }

  let lhs = nudHandler(parser);

  while (
    bpLookup.get(parser.currentToken.type) ??
    BindingPower.default > bp
  ) {
    const ledHandler = ledLookup.get(parser.currentToken.type);

    if (!ledHandler) {
      raise(
        `:: Internal Error -> No handler found for LED expression: ${parser.advance()}`
      );
      return {} as Expression; // ! Unreachable
    }

    lhs = ledHandler(
      parser,
      lhs,
      bpLookup.get(parser.currentToken.type) ?? BindingPower.default
    );
  }

  return lhs;
};

export const parseFunctionDeclarationExpr = (parser: Parser): Expression => {
  parser.advance();

  const name = parseExpression(parser, BindingPower.default);
  const params = parseArgs(parser, TokenType.OpenBrace).map((e) => (e as Identifier).value);
  const body = parseCodeBlock(parser);

  const expr: FunctionDeclarationExpr = {
    type: 'FunctionDeclaration',
    name: name as Identifier,
    params,
    body
  }
  return expr;
};

export const parseFunctionCallExpr = (parser: Parser): Expression => {
  parser.advance();

  const callee = parseExpression(parser, BindingPower.default);

  const args = parseArgs(parser, TokenType.EOL);

  const expr: FunctionCallExpression = {
    type: "FunctionCallExpression",
    callee,
    args,
  }

  return expr;
}


export const parsePrimaryExpression = (parser: Parser): Expression => {
  switch (parser.currentToken.type) {
    case TokenType.Number: {
      const num = parseFloat(parser.advance().value);
      const expr: NumericLiteral = {
        type: "NumericLiteral",
        value: num,
      };

      return expr;
    }

    case TokenType.String: {
      const expr: StringLiteral = {
        type: "StringLiteral",
        value: parser.advance().value,
      };
      return expr;
    }

    case TokenType.Identifier: {
      const expr: Identifier = {
        type: "Identifier",
        value: parser.advance().value,
      };
      return expr;
    }

    default:
      raise(
        `:: Internal Error -> Unknown type for primary expression: ${parser.advance()}`
      );
      return {} as Expression; // ! This line won't be reached
  }
};

export const parseBinaryExpression = (
  parser: Parser,
  lhs: Expression,
  bp: BindingPower
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
  const rhs = parseExpression(parser, BindingPower.default);

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
  bp: BindingPower
): Expression => {
  let explicitType: Type | undefined = undefined;
  let value: Expression | undefined = undefined;
  const isConstant = parser.currentToken.type === TokenType.Const;

  parser.advance();

  if (parser.currentToken.type !== TokenType.ExplicitType) {
    value = parseExpression(parser, bp);
  }

  if (parser.currentToken.type === TokenType.ExplicitType) {
    parser.advance();
    explicitType = parseType(parser, BindingPower.default);
  }

  if (isConstant && !value) {
    raise("Cannot declare constant entity without value (are you stupid?)");
  }

  const expr: VariableDeclarationExpression = {
    type: "VariableDeclaration",
    identifier: lhs as Identifier,
    value,
    explicitType,
    isConstant,
  };

  return expr;
};

export const parseAssignmentExpression = (
  parser: Parser,
  lhs: Expression,
  bp: BindingPower
): Expression => {
  parser.advance();
  const rhs = parseExpression(parser, bp);

  const expr: VariableAssignmentExpression = {
    type: "VariableAssignment",
    assignee: lhs as Identifier,
    value: rhs,
  };

  return expr;
};

export const parseGroupingExpression = (parser: Parser) => {
  parser.advance();

  const expr = parseExpression(parser, BindingPower.default);

  parser.expect(TokenType.CloseParenthesis);

  return expr;
};

export const parseRecordConstruction = (
  parser: Parser,
  lhs: Expression,
  bp: BindingPower
): Expression => {
  if (!("value" in lhs) || typeof lhs.value !== "string")
    return {} as Expression;
  const name = lhs.value;
  const properties: RecordConstructionExpression["properties"] = new Map();

  parser.expect(TokenType.OpenBrace);

  while (
    parser.hasTokens &&
    parser.currentToken.type !== TokenType.CloseBrace
  ) {
    const propName = parser.expect(TokenType.Identifier).value;
    parser.expect(TokenType.Colon);
    const propValue = parseExpression(parser, BindingPower.assignment);
    properties.set(propName, propValue);
  }

  parser.expect(TokenType.CloseBrace);

  const expr: RecordConstructionExpression = {
    type: "RecordConstruction",
    name,
    properties,
  };

  return expr;
};

export const parseArrayLiteral = (parser: Parser): Expression => {
  parser.expect(TokenType.OpenBracket);

  const value = Array<Expression>();

  while (
    parser.hasTokens &&
    parser.currentToken.type !== TokenType.CloseBracket
  ) {
    const prop = parseExpression(parser, BindingPower.assignment);
    value.push(prop);

    // @ts-expect-error
    if (parser.currentToken.type !== TokenType.CloseBracket) {
      parser.expect(TokenType.Comma);
    }
  }

  parser.expect(TokenType.CloseBracket);

  const expr: ArrayLiteral = {
    type: "ArrayLiteral",
    value,
  };

  return expr;
};



export const parseArgs = (parser: Parser, terminalCharType: TokenType) => {
  const args = [];

  while (parser.hasTokens && parser.currentToken.type !== terminalCharType) {
    args.push(parseExpression(parser, BindingPower.default));
  }

  return args;
}

export const parseCodeBlock = (parser: Parser) => {
  parser.expect(TokenType.OpenBrace);

  const body = Array<Statement>();

  while (parser.hasTokens && parser.currentToken.type !== TokenType.CloseBrace) {
    body.push(parseStatement(parser));
  }

  parser.expect(TokenType.CloseBrace);

  return body;
}
