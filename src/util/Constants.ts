import Scope from "../interpreter/scope";

export const TokenTypes = {
  /* Datatypes */
  Number: "Number",
  String: "String",
  Identifier: "Identifier",

  /* Reserved Keywords */

  Let: "Let",
  Const: "Const",
  Assignment: "Assignment",
  Function: "Function",
  If: "If",
  Else: "Else",
  Print: "Print",
  FunctionCall: "FunctionCall",
  Throw: "Throw",

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

  Plus: "Plus",
  Minus: "Minus",
  Multiply: "Multiply",
  Divide: "Divide",
  Modular: "Modular",

  Equals: "Equals",
  Greater: "Greater",
  GreaterEquals: "GreaterEquals",
  Less: "Less",
  LessEquals: "LessEquals",

  And: "And",
  Or: "Or",
  Not: "Not",

  Comment: "Comment",

  EOF: "EOF",
  EOL: "EOL",
  FunctionCallEnd: "FunctionCallEnd",
} as const;

export type TokenType = (typeof TokenTypes)[keyof typeof TokenTypes];

export type Token = {
  type: TokenType;
  value: string;
};

export const Keywords = {
  if: TokenTypes.If,
  else: TokenTypes.Else,
  is: TokenTypes.Const,
  rn: TokenTypes.FunctionCallEnd,
  fr: TokenTypes.EOL,
  and: TokenTypes.And,
  or: TokenTypes.Or,
  no: TokenTypes.Not,

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

const Chars = {
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

  "+": TokenTypes.Plus,
  "-": TokenTypes.Minus,
  "*": TokenTypes.Multiply,
  "/": TokenTypes.Divide,
  "%": TokenTypes.Modular,

  "<": TokenTypes.Less,
  "<=": TokenTypes.LessEquals,
  ">": TokenTypes.Greater,
  ">=": TokenTypes.GreaterEquals,
  "=": TokenTypes.Equals,
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
  | "StringLiteral"
  | "Identifier"
  | "Symbol"
  | "Block"
  | "Expression"
  | "BinaryExpression"
  | "MemberExpression"
  | "FunctionCallExpression"
  | "PrintExpression"
  | "IfCondition"
  | "VariableAssignmentExpression";

export interface Statement {
  type: NodeType;
}

export interface ExpressionStatement extends Statement {
  type: "Expression";
  expression: Expression;
}

export interface Program extends Statement {
  type: "Program";
  body: Statement[];
}

export interface BlockStatement extends Statement {
  type: "Block";
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

export interface IfStatement extends Statement {
  type: "IfCondition";
  condition?: Expression;
  body: Statement[];
  orElse?: IfStatement;
}

export interface Expression extends Statement {}

// --> Literal Expressions <--
export interface NumericLiteral extends Expression {
  type: "NumericLiteral";
  value: number;
}

export interface ObjectLiteral extends Expression {
  type: "ObjectLiteral";
  value: Property[];
}

export interface StringLiteral extends Expression {
  type: "StringLiteral";
  value: string;
}

export interface BinaryExpression extends Expression {
  type: "BinaryExpression";
  lhs: Expression;
  rhs: Expression;
  operator: Token;
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
  value: string;
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
  | "if"
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

export interface IfConditionValue extends RuntimeValue {
  type: "if";
  condition: Expression;
  body: Statement[];
  orElse?: IfConditionValue;
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
