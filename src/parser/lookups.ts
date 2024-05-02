import { Parser } from ".";
import { Expression, Statement, TokenType } from "../types";
import { parseBinaryExpression, parsePrimaryExpression } from "./expression";
import { parseVariableDeclarationStatement } from "./statement";

export const BindingPowerTable = {
  default: 0,
  comma: 1,
  assignment: 2,
  logical: 3,
  relational: 4,
  additive: 5,
  multiplicative: 6,
  unary: 7,
  call: 8,
  member: 9,
  primary: 10,
} as const;

export type BindingPower =
  (typeof BindingPowerTable)[keyof typeof BindingPowerTable];

export type StatementHandler = (parser: Parser) => Statement;
export type NudHandler = (parser: Parser) => Expression;
export type LedHandler = (
  parser: Parser,
  lhs: Expression,
  bp: BindingPower,
) => Expression;

export const bpLookup = new Map<TokenType, BindingPower>();
export const ledLookup = new Map<TokenType, LedHandler>();
export const nudLookup = new Map<TokenType, NudHandler>();
export const statementLookup = new Map<TokenType, StatementHandler>();

export const led = (type: TokenType, bp: BindingPower, handler: LedHandler) => {
  bpLookup.set(type, bp);
  ledLookup.set(type, handler);
};

export const nud = (type: TokenType, bp: BindingPower, handler: NudHandler) => {
  bpLookup.set(type, bp);
  nudLookup.set(type, handler);
};

export const statement = (type: TokenType, handler: StatementHandler) => {
  bpLookup.set(type, BindingPowerTable.default);
  statementLookup.set(type, handler);
};

export const createLookups = () => {
  // --> Statements <--
  statement("Let", parseVariableDeclarationStatement);
  statement("Const", parseVariableDeclarationStatement);

  // --> LED & NUD <--
  // -> 3
  led("And", BindingPowerTable.logical, parseBinaryExpression);
  led("Or", BindingPowerTable.logical, parseBinaryExpression);

  // -> 4
  led("Equals", BindingPowerTable.relational, parseBinaryExpression);
  led("Greater", BindingPowerTable.relational, parseBinaryExpression);
  led("GreaterEquals", BindingPowerTable.relational, parseBinaryExpression);
  led("Less", BindingPowerTable.relational, parseBinaryExpression);
  led("LessEquals", BindingPowerTable.relational, parseBinaryExpression);

  // -> 5
  led("Plus", BindingPowerTable.additive, parseBinaryExpression);
  led("Minus", BindingPowerTable.additive, parseBinaryExpression);

  // -> 6
  led("Multiply", BindingPowerTable.multiplicative, parseBinaryExpression);
  led("Divide", BindingPowerTable.multiplicative, parseBinaryExpression);
  led("Modular", BindingPowerTable.multiplicative, parseBinaryExpression);

  // -> 10
  nud("Number", BindingPowerTable.primary, parsePrimaryExpression);
  nud("String", BindingPowerTable.primary, parsePrimaryExpression);
  nud("Identifier", BindingPowerTable.primary, parsePrimaryExpression);
};
