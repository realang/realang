import { Statement } from "./statement.types";
import { Token } from "./tokens.types";
import { Type } from "./types.types";

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

// --> <--

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

export interface VariableDeclarationExpression extends Expression {
  type: "VariableDeclaration";
  identifier: Expression;
  value?: Expression;
  explicitType?: Type;
  isConstant: boolean;
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

export interface PrefixExpression extends Expression {
  type: "PrefixExpression";
  rhs: Expression;
  operator: Token;
}
