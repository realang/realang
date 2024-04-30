import { Lexer } from ".";
import { TokenType } from "../util";

export const handleDefault = (type: TokenType, value: string) => {
  const func = (lex: Lexer) => {
    lex.advancePos(value.length);
    lex.tokens.push({ type, value });
  };

  return func;
};

export const handleWhitespace = (lex: Lexer, regex: RegExp) => {
  const match = regex.exec(lex.srcAfterPos());

  if (!match) return;

  lex.advancePos(match?.index + (match?.at(0)?.length ?? 0));
};
