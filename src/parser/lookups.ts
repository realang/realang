import { Parser } from ".";
import { TokenType } from "../lib/tokens";
import { Expression, Statement } from "../types";
import {
  parseArrayLiteral,
  parseAssignmentExpression,
  parseBinaryExpression,
  parseFunctionCallExpr,
  parseFunctionDeclarationExpr,
  parsePrefixExpression,
  parsePrimaryExpression,
  parseVariableDeclarationExpression,
} from "./expression";
import { parseRecordDeclarationStatement } from "./statement";

export const enum BindingPower {
  default,
  comma,
  assignment,
  logical,
  relational,
  additive,
  multiplicative,
  unary,
  call,
  member,
  primary,
}

export type StatementHandler = (parser: Parser) => Statement;
export type NudHandler = (parser: Parser) => Expression;
export type LedHandler = (
  parser: Parser,
  lhs: Expression,
  bp: BindingPower
) => Expression;

export const bpLookup = new Map<TokenType, BindingPower>();
export const ledLookup = new Map<TokenType, LedHandler>();
export const nudLookup = new Map<TokenType, NudHandler>();
export const statementLookup = new Map<TokenType, StatementHandler>();

export const led = (
  type: TokenType,
  bp: BindingPower,
  handler: LedHandler
) => {
  bpLookup.set(type, bp);
  ledLookup.set(type, handler);
};

export const nud = (type: TokenType, handler: NudHandler) => {
  nudLookup.set(type, handler);
};

export const statement = (type: TokenType, handler: StatementHandler) => {
  bpLookup.set(type, BindingPower.default);
  statementLookup.set(type, handler);
};

export const createLookups = () => {
  // ---> STATEMENTS <---
  statement(TokenType.Record, parseRecordDeclarationStatement);
  nud(TokenType.Function, parseFunctionDeclarationExpr);
  nud(TokenType.FunctionCall, parseFunctionCallExpr);

  // --> LED & NUD <--

  // -> 2
  led(
    TokenType.Const,
    BindingPower.assignment,
    parseVariableDeclarationExpression
  );
  led(
    TokenType.Let,
    BindingPower.assignment,
    parseVariableDeclarationExpression
  );
  led(
    TokenType.Assignment,
    BindingPower.assignment,
    parseAssignmentExpression
  );

  // -> 3
  led(TokenType.And, BindingPower.logical, parseBinaryExpression);
  led(TokenType.Or, BindingPower.logical, parseBinaryExpression);
  led(TokenType.Not, BindingPower.unary, parsePrefixExpression);
  // led(TokenType.Comma, BindingPowerTable.comma, () => {});

  // -> 4
  led(TokenType.Equals, BindingPower.relational, parseBinaryExpression);
  led(TokenType.Greater, BindingPower.relational, parseBinaryExpression);
  led(
    TokenType.GreaterEquals,
    BindingPower.relational,
    parseBinaryExpression
  );
  led(TokenType.Less, BindingPower.relational, parseBinaryExpression);
  led(
    TokenType.LessEquals,
    BindingPower.relational,
    parseBinaryExpression
  );

  // -> 5
  led(TokenType.Plus, BindingPower.additive, parseBinaryExpression);
  led(TokenType.Minus, BindingPower.additive, parseBinaryExpression);

  // -> 6
  led(
    TokenType.Multiply,
    BindingPower.multiplicative,
    parseBinaryExpression
  );
  led(
    TokenType.Divide,
    BindingPower.multiplicative,
    parseBinaryExpression
  );
  led(
    TokenType.Modular,
    BindingPower.multiplicative,
    parseBinaryExpression
  );

  // -> 8
  // led(TokenType.OpenBrace, BindingPower.call, parseRecordConstruction);

  // -> 10
  nud(TokenType.Number, parsePrimaryExpression);
  nud(TokenType.String, parsePrimaryExpression);
  nud(TokenType.Identifier, parsePrimaryExpression);
  nud(TokenType.OpenBracket, parseArrayLiteral);
  nud(TokenType.Minus, parsePrefixExpression);
};
