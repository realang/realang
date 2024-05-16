import type { TokenType } from "../lib/tokens";

export type Token = {
  type: TokenType;
  value: string;
};
