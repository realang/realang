import {
  BooleanValue,
  Function,
  NativeFunctionValue,
  NullValue,
  NumberValue,
} from "../types";

export const NUM = (n = 0) => ({ type: "number", value: n }) as NumberValue;

export const NULL = () => ({ type: "null", value: null }) as NullValue;

export const BOOL = (b: boolean) => {
  return { type: "boolean", value: b } as BooleanValue;
};

export const NATIVE_FN = (call: Function): NativeFunctionValue => {
  return { type: "native", call } as NativeFunctionValue;
};
