import { Lexer } from ".";
import {
  handleComment,
  handleDefault,
  handleNumber,
  handleString,
  handleSymbol,
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
        type: "Let",
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
        type: "Assignment",
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
        type: "Print",
        value,
      });

      lex.advancePos(value.length);
    },
  },

  { regex: /[0-9]+(\.[0-9]+)?/, handler: handleNumber },
  { regex: /[a-zA-Z_][a-zA-Z0-9_]*/, handler: handleSymbol },
  { regex: /"[^"]*"/, handler: handleString },
  { regex: /\s+/, handler: handleWhitespace },

  { regex: /\./, handler: handleDefault("Dot", ".") },
  { regex: /,/, handler: handleDefault("Comma", ",") },
  { regex: /:/, handler: handleDefault("Colon", ":") },

  { regex: /"/, handler: handleDefault("Quotation", '"') },
  { regex: /'/, handler: handleDefault("Quotation", "'") },

  { regex: /\(/, handler: handleDefault("OpenParenthesis", "(") },
  { regex: /\)/, handler: handleDefault("CloseParenthesis", ")") },
  { regex: /{/, handler: handleDefault("OpenBrace", "{") },
  { regex: /}/, handler: handleDefault("CloseBrace", "}") },
  { regex: /\[/, handler: handleDefault("OpenBracket", "[") },
  { regex: /\]/, handler: handleDefault("CloseBracket", "]") },

  { regex: /\+/, handler: handleDefault("Plus", "+") },
  { regex: /-/, handler: handleDefault("Minus", "-") },
  { regex: /\*/, handler: handleDefault("Multiply", "*") },
  { regex: /\//, handler: handleDefault("Divide", "/") },
  { regex: /%/, handler: handleDefault("Modular", "%") },
];
