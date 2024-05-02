import { Lexer } from ".";
import { Keywords, TokenType } from "../util";

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

export const handleNumber = (lex: Lexer, regex: RegExp) => {
  const value = regex.exec(lex.srcAfterPos())?.at(0);

  if (!value) return;

  lex.tokens.push({ type: "Number", value });
  lex.advancePos(value?.length);
};

export const handleSymbol = (lex: Lexer, regex: RegExp) => {
  const match = regex.exec(lex.srcAfterPos());
  const value = lex.srcAfterPos().slice(match?.index, match?.at(0)?.length);

  if (Object.keys(Keywords).includes(value)) {
    lex.tokens.push({
      type: Keywords[value as keyof typeof Keywords] as TokenType,
      value,
    });
  } else {
    lex.tokens.push({ type: "Identifier", value });
  }

  lex.advancePos(value.length);
};

export const handleString = (lex: Lexer, regex: RegExp) => {
  const match = regex.exec(lex.srcAfterPos());
  const value = lex
    .srcAfterPos()
    .slice(match?.index! + 1, match?.at(0)?.length! - 1);

  lex.tokens.push({ type: "String", value });
  lex.advancePos(value.length + 2);
};

export const handleComment = (lex: Lexer, regex: RegExp) => {
  const match = regex.exec(lex.srcAfterPos());
  if (match) {
    lex.advancePos(match.at(0)?.length ?? 0);
    lex.trace.line++;
  }
};
