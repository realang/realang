import { Lexer } from ".";
import { TokenType } from "../lib/tokens";
import {
  handleComment,
  handleDefault,
  handleNumber,
  handleString,
  handleKeyword,
  handleWhitespace,
} from "./handlers";

export type LexerPattern = {
  regex: RegExp;
  handler: (lex: Lexer, regex: RegExp) => void;
};

export const patterns: LexerPattern[] = [
  { regex: /(?<=^|\s)unreal .*?(?=\n|$)/, handler: handleComment },

  // Multi-line characters

  {
    regex: /thinks hes/,
    handler: (lex, regex) => {
      const match = regex.exec(lex.srcAfterPos());
      const value = lex.srcAfterPos().slice(match?.index, match?.at(0)?.length);

      lex.tokens.push({
        type: TokenType.Let,
        value,
      });

      lex.advancePos(value.length);
    },
  },

  {
    regex: /better be/,
    handler: (lex, regex) => {
      const match = regex.exec(lex.srcAfterPos());
      const value = lex.srcAfterPos().slice(match?.index, match?.at(0)?.length);

      lex.tokens.push({
        type: TokenType.Assignment,
        value,
      });

      lex.advancePos(value.length);
    },
  },

  {
    regex: /of type/,
    handler: (lex, regex) => {
      const match = regex.exec(lex.srcAfterPos());
      const value = lex.srcAfterPos().slice(match?.index, match?.at(0)?.length);

      lex.tokens.push({
        type: TokenType.ExplicitType,
        value,
      });

      lex.advancePos(value.length);
    },
  },

  {
    regex: /bro really said/,
    handler: (lex, regex) => {
      const match = regex.exec(lex.srcAfterPos());
      const value = lex.srcAfterPos().slice(match?.index, match?.at(0)?.length);

      lex.tokens.push({
        type: TokenType.Print,
        value,
      });

      lex.advancePos(value.length);
    },
  },

  { regex: /[0-9]+(\.[0-9]+)?/, handler: handleNumber },
  { regex: /[a-zA-Z_][a-zA-Z0-9_]*/, handler: handleKeyword },
  { regex: /("[^"]*"|'[^']*')/, handler: handleString },
  { regex: /\s+/, handler: handleWhitespace },

  { regex: /\./, handler: handleDefault(TokenType.Dot, ".") },
  { regex: /,/, handler: handleDefault(TokenType.Comma, ",") },
  // { regex: /,/, handler: () => {} },
  { regex: /:/, handler: handleDefault(TokenType.Colon, ":") },

  { regex: /"/, handler: handleDefault(TokenType.Quotation, '"') },
  { regex: /'/, handler: handleDefault(TokenType.Quotation, "'") },

  { regex: /\(/, handler: handleDefault(TokenType.OpenParenthesis, "(") },
  { regex: /\)/, handler: handleDefault(TokenType.CloseParenthesis, ")") },
  { regex: /{/, handler: handleDefault(TokenType.OpenBrace, "{") },
  { regex: /}/, handler: handleDefault(TokenType.CloseBrace, "}") },
  { regex: /\[/, handler: handleDefault(TokenType.OpenBracket, "[") },
  { regex: /\]/, handler: handleDefault(TokenType.CloseBracket, "]") },

  { regex: /\+/, handler: handleDefault(TokenType.Plus, "+") },
  { regex: /-/, handler: handleDefault(TokenType.Minus, "-") },
  { regex: /\*/, handler: handleDefault(TokenType.Multiply, "*") },
  { regex: /\//, handler: handleDefault(TokenType.Divide, "/") },
  { regex: /%/, handler: handleDefault(TokenType.Modular, "%") },

  { regex: /</, handler: handleDefault(TokenType.Less, "<") },
  { regex: />/, handler: handleDefault(TokenType.Greater, ">") },
];
