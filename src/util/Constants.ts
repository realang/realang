import Scope from "../interpreter/scope";

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

  Dot: "Dot",
  Comma: "Comma",
  Colon: "Colon",
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
  EOL: "EOL",
  FunctionCallEnd: "FunctionCallEnd",
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
  rn: TokenTypes.FunctionCallEnd,
  fr: TokenTypes.EOL,

  thinks: TokenTypes.Let,
  hes: TokenTypes.Let,

  better: TokenTypes.Assignment,
  be: TokenTypes.Assignment,

  bro: TokenTypes.Print,
  really: TokenTypes.Print,
  said: TokenTypes.Print,

  unreal: TokenTypes.Comment,
  yo: TokenTypes.FunctionCall,
  real: TokenTypes.Function,
  yowtf: TokenTypes.Throw,
} as const;

const Chars: Record<string, TokenType> = {
  ".": TokenTypes.Dot,
  ",": TokenTypes.Comma,
  ":": TokenTypes.Colon,
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
  | "BinaryExpression"
  | "MemberExpression"
  | "FunctionCallExpression"
  | "PrintExpression"
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

export interface FunctionDeclaration extends Statement {
  type: "FunctionDeclaration";
  name: string;
  params: string[];
  body: Statement[];
}

export interface Expression extends Statement {}

export interface BinaryExpression extends Expression {
  type: "BinaryExpression";
  lhs: Expression;
  rhs: Expression;
  operator: string;
}

export interface MemberExpression extends Expression {
  type: "MemberExpression";
  object: Expression;
  property: Expression;
  computed: boolean;
}

export interface FunctionCallExpression extends Expression {
  type: "FunctionCallExpression";
  args: Expression[];
  callee: Expression;
}

export interface VariableAssignmentExpression extends Expression {
  type: "VariableAssignmentExpression";
  assignee: Expression;
  value: Expression;
}

export interface PrintExpression extends Expression {
  type: "PrintExpression";
  args: Expression[];
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

export type ValueType =
  | "null"
  | "number"
  | "boolean"
  | "string"
  | "object"
  | "native"
  | "function";

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

export type Function = (args: RuntimeValue[], scope: Scope) => RuntimeValue;

export interface FunctionValue extends RuntimeValue {
  type: "function";
  name: string;
  params: string[];
  scope: Scope;
  body: Statement[];
}

export interface NativeFunctionValue extends RuntimeValue {
  type: "native";
  call: Function;
}
