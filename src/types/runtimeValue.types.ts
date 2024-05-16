import Scope from "../compiler/scope";
import { Expression } from "./expression.types";
import { Statement } from "./statement.types";

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
