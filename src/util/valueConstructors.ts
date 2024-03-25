import { BooleanValue, NullValue, NumberValue } from ".";

export const NUM = (n = 0) => ({ type: "number", value: n }) as NumberValue;

export const NULL = () => ({ type: "null", value: null }) as NullValue;

export const BOOL = (b: boolean) => {
  return { type: "boolean", value: b } as BooleanValue;
};
