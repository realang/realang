import { Expression } from "./expression.types";
import { Token } from "./tokens.types";
import { Type } from "./types.types";

export type StatementType =
  | "Program"
  | "FunctionDeclaration"
  | "RecordDeclaration"
  | "Block"
  | "Expression"
  | "IfCondition";

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

export interface RecordDeclarationStatement extends Statement {
  type: "RecordDeclaration";
  name: Token;
  properties: Map<string, Type>;
  // methods: Map<string, Object>; //TODO add FunctionType
}

export interface IfStatement extends Statement {
  type: "IfCondition";
  condition: Expression;
  body: Statement[];
  orElse?: IfStatement;
}
