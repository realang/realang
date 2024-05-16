import { Parser } from ".";
import { Expression, Identifier, Statement } from "../types";
import { TokenType } from "../lib/tokens";
import {
  parseArrayLiteral,
  parseAssignmentExpression,
  parseBinaryExpression,
  parseFunctionExpression,
  parsePrefixExpression,
  parsePrimaryExpression,
  parseRecordConstruction,
  parseVariableDeclarationExpression,
} from "./expression";
import { parseRecordDeclarationStatement } from "./statement";

export const enum BindingPowerTable {
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
  bp: BindingPowerTable
) => Expression;

export const bpLookup = new Map<TokenType, BindingPowerTable>();
export const ledLookup = new Map<TokenType, LedHandler>();
export const nudLookup = new Map<TokenType, NudHandler>();
export const statementLookup = new Map<TokenType, StatementHandler>();

export const led = (
  type: TokenType,
  bp: BindingPowerTable,
  handler: LedHandler
) => {
  bpLookup.set(type, bp);
  ledLookup.set(type, handler);
};

export const nud = (type: TokenType, handler: NudHandler) => {
  nudLookup.set(type, handler);
};

export const statement = (type: TokenType, handler: StatementHandler) => {
  bpLookup.set(type, BindingPowerTable.default);
  statementLookup.set(type, handler);
};

export const createLookups = () => {
  // ---> STATEMENTS <---
  statement(TokenType.Record, parseRecordDeclarationStatement);

  // --> LED & NUD <--

  // -> 2
  led(
    TokenType.Const,
    BindingPowerTable.assignment,
    parseVariableDeclarationExpression
  );
  led(
    TokenType.Let,
    BindingPowerTable.assignment,
    parseVariableDeclarationExpression
  );
  led(
    TokenType.Assignment,
    BindingPowerTable.assignment,
    parseAssignmentExpression
  );
  nud(TokenType.Function, parseFunctionExpression);

  // -> 3
  led(TokenType.And, BindingPowerTable.logical, parseBinaryExpression);
  led(TokenType.Or, BindingPowerTable.logical, parseBinaryExpression);
  led(TokenType.Not, BindingPowerTable.unary, parsePrefixExpression);
  // led(TokenType.Comma, BindingPowerTable.comma, () => {});

  // -> 4
  led(TokenType.Equals, BindingPowerTable.relational, parseBinaryExpression);
  led(TokenType.Greater, BindingPowerTable.relational, parseBinaryExpression);
  led(
    TokenType.GreaterEquals,
    BindingPowerTable.relational,
    parseBinaryExpression
  );
  led(TokenType.Less, BindingPowerTable.relational, parseBinaryExpression);
  led(
    TokenType.LessEquals,
    BindingPowerTable.relational,
    parseBinaryExpression
  );

  // -> 5
  led(TokenType.Plus, BindingPowerTable.additive, parseBinaryExpression);
  led(TokenType.Minus, BindingPowerTable.additive, parseBinaryExpression);

  // -> 6
  led(
    TokenType.Multiply,
    BindingPowerTable.multiplicative,
    parseBinaryExpression
  );
  led(
    TokenType.Divide,
    BindingPowerTable.multiplicative,
    parseBinaryExpression
  );
  led(
    TokenType.Modular,
    BindingPowerTable.multiplicative,
    parseBinaryExpression
  );

  // -> 8
  led(TokenType.OpenBrace, BindingPowerTable.call, parseRecordConstruction);

  // -> 10
  nud(TokenType.Number, parsePrimaryExpression);
  nud(TokenType.String, parsePrimaryExpression);
  nud(TokenType.Identifier, parsePrimaryExpression);
  nud(TokenType.OpenBracket, parseArrayLiteral);
  nud(TokenType.Minus, parsePrefixExpression);
};
