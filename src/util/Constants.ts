export const TokenTypes = {
  Number: "Number",
  String: "String",
  Identifier: "Identifier",

  Let: "Let",
  Const: "Const",
  Assignment: "Assignment",
  Function: "Function",
  If: "If",
  Else: "Else",
  Print: "Print",
  FunctionCall: "FunctionCall",
  Throw: "Throw",

  Not: "Not",
  EqualityCheck: "EqualityCheck",
  Greater: "Greater",
  Less: "Less",

  Comma: "Comma",
  Colon: "Colon",
  Semicolon: "Semicolon",
  Quotation: "Quotation",
  OpenBrace: "OpenBrace",
  CloseBrace: "CloseBrace",
  OpenBracket: "OpenBracket",
  CloseBracket: "CloseBracket",
  OpenParenthesis: "OpenParenthesis",
  CloseParenthesis: "CloseParenthesis",

  BinaryOperator: "BinaryOperator",

  Comment: "Comment",

  EOF: "EOF",
  Skull: "Skull",
} as const;

export type TokenType = (typeof TokenTypes)[keyof typeof TokenTypes];

export type Token = {
  value: string;
  type: TokenType;
};

const Keywords: Record<string, TokenType> = {
  if: TokenTypes.If,
  else: TokenTypes.Else,
  IS: TokenTypes.Const,
  is: TokenTypes.EqualityCheck,
  thinks: TokenTypes.Let,
  hes: TokenTypes.Let,
  better: TokenTypes.Assignment,
  be: TokenTypes.Assignment,
  "bro really said": TokenTypes.Print,
  unreal: TokenTypes.Comment,
  yo: TokenTypes.FunctionCall,
  real: TokenTypes.Function,
  yowtf: TokenTypes.Throw,
} as const;

const Chars: Record<string, TokenType> = {
  ",": TokenTypes.Comma,
  ":": TokenTypes.Colon,
  "💀": TokenTypes.Semicolon,
  '"': TokenTypes.Quotation,

  "(": TokenTypes.OpenParenthesis,
  ")": TokenTypes.CloseParenthesis,
  "{": TokenTypes.OpenBrace,
  "}": TokenTypes.CloseBrace,
  "[": TokenTypes.OpenBracket,
  "]": TokenTypes.CloseBracket,

  "+": TokenTypes.BinaryOperator,
  "-": TokenTypes.BinaryOperator,
  "*": TokenTypes.BinaryOperator,
  "/": TokenTypes.BinaryOperator,
  "%": TokenTypes.BinaryOperator,

  "<": TokenTypes.Less,
  ">": TokenTypes.Greater,
} as const;

export const Tokens = {
  Keywords,
  Chars,
} as const;

/***
 * AST Definitions
 */

export type NodeType =
  | "Program"
  | "VariableDeclaration"
  | "FunctionDeclaration"
  | "Property"
  | "ObjectLiteral"
  | "NumericLiteral"
  | "Identifier"
  | "FunctionCall"
  | "BinaryExpression"
  | "VariableAssignmentExpression";

export interface Statement {
  type: NodeType;
}

export interface Program extends Statement {
  type: "Program";
  body: Statement[];
}

export interface VariableDeclaration extends Statement {
  type: "VariableDeclaration";
  isConstant: boolean;
  identifier: string;
  value?: Expression;
}

export interface Expression extends Statement {}

export interface BinaryExpression extends Expression {
  type: "BinaryExpression";
  lhs: Expression;
  rhs: Expression;
  operator: string;
}

export interface VariableAssignmentExpression extends Expression {
  type: "VariableAssignmentExpression";
  assignee: Expression;
  value: Expression;
}

export interface Identifier extends Expression {
  type: "Identifier";
  symbol: string;
}

export interface NumericLiteral extends Expression {
  type: "NumericLiteral";
  value: number;
}

export interface ObjectLiteral extends Expression {
  type: "ObjectLiteral";
  properties: Property[];
}

export interface Property extends Expression {
  type: "Property";
  key: string;
  value?: Expression;
}

/***
 * Runtime Values
 */

export type ValueType = "null" | "number" | "boolean" | "string" | "object";

export interface RuntimeValue {
  type: ValueType;
}

export interface NullValue extends RuntimeValue {
  type: "null";
  value: null;
}

export interface BooleanValue extends RuntimeValue {
  type: "boolean";
  value: boolean;
}

export interface NumberValue extends RuntimeValue {
  type: "number";
  value: number;
}

export interface StringValue extends RuntimeValue {
  type: "string";
  value: string;
}

export interface ObjectValue extends RuntimeValue {
  type: "object";
  properties: Map<string, RuntimeValue>;
}
