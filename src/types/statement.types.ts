import { Expression } from "./expression.types";

export type StatementType =
  | "Program"
  | "VariableDeclaration"
  | "FunctionDeclaration"
  | "RecordDeclaration"
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
  | "PrefixExpression"
  | "IfCondition"
  | "VariableAssignmentExpression";

export interface Statement {
  type: StatementType;
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

export interface FunctionDeclaration extends Statement {
  type: "FunctionDeclaration";
  name: string;
  params: string[];
  body: Statement[];
}

export interface RecordDeclaration extends Statement {
  type: "RecordDeclaration";
  name: string;
  properties: Map<string, Expression>;
}

export interface IfStatement extends Statement {
  type: "IfCondition";
  condition?: Expression;
  body: Statement[];
  orElse?: IfStatement;
}
