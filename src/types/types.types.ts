export type TypeType = "Symbol" | "Array";

export interface Type {
  type: TypeType;
}

export interface SymbolType extends Type {
  type: "Symbol";
  name: string;
}

export interface ArrayType extends Type {
  type: "Array";
  base: Type;
}
