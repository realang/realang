export const TokenTypes = {
  Number: "Number",
  String: "String",
  Identifier: "Identifier",

  Let: "Let",
  Const: "Const",
  Function: "Function",
  If: "If",
  Else: "Else",
  Print: "Print",
  FunctionCall: "FunctionCall",
  Throw: "Throw",

  Not: "Not",
  Equals: "Equals",
  Greater: "Greater",
  Less: "Less",

  Quotation: "Quotation",
  Semicolon: "Semicolon",
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
  const: TokenTypes.Const,
  // "thinks hes": TokenTypes.Let,
  let: TokenTypes.Let,
  "bro really said": TokenTypes.Print,
  unreal: TokenTypes.Comment,
  yo: TokenTypes.FunctionCall,
  real: TokenTypes.Function,
  yowtf: TokenTypes.Throw,
} as const;

const Chars: Record<string, TokenType> = {
  '"': TokenTypes.Quotation,
  "💀": TokenTypes.Semicolon,

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
  | "NumericLiteral"
  | "Identifier"
  | "BinaryExp"
  | "CallExp"
  | "CallExp";

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

export interface Expression extends Statement { }

export interface BinaryExp extends Expression {
  type: "BinaryExp";
  lhs: Expression;
  rhs: Expression;
  operator: string;
}

export interface Identifier extends Expression {
  type: "Identifier";
  symbol: string;
}

export interface NumericLiteral extends Expression {
  type: "NumericLiteral";
  value: number;
}

/***
 * Runtime Values
 */

export type ValueType = "null" | "number" | "boolean" | "string";

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
