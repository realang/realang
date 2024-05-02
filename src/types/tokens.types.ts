import { TokenTypes } from "../lib/tokens";

export type TokenType = (typeof TokenTypes)[keyof typeof TokenTypes];

export type Token = {
  type: TokenType;
  value: string;
};
