import { Parser } from ".";
import { Expression, Statement, TokenType } from "../types";
import {
  parseAssignmentExpression,
  parseBinaryExpression,
  parsePrefixExpression,
  parsePrimaryExpression,
  parseVariableDeclarationExpression,
} from "./expression";
import { parseRecordDeclarationStatement } from "./statement";

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

export const nud = (type: TokenType, handler: NudHandler) => {
  nudLookup.set(type, handler);
};

export const statement = (type: TokenType, handler: StatementHandler) => {
  bpLookup.set(type, BindingPowerTable.default);
  statementLookup.set(type, handler);
};

export const createLookups = () => {
  // ---> STATEMENTS <---
  statement("Record", parseRecordDeclarationStatement);

  // --> LED & NUD <--

  // -> 2
  led(
    "Const",
    BindingPowerTable.assignment,
    parseVariableDeclarationExpression,
  );
  led("Let", BindingPowerTable.assignment, parseVariableDeclarationExpression);
  led("Assignment", BindingPowerTable.assignment, parseAssignmentExpression);

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
  nud("Number", parsePrimaryExpression);
  nud("String", parsePrimaryExpression);
  nud("Identifier", parsePrimaryExpression);
  nud("Minus", parsePrefixExpression);
};
