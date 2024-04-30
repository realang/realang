import { Token, TokenType, raise } from "../util";
import { handleDefault, handleWhitespace } from "./handlers";

export const lexerPatterns: LexerPattern[] = [
  { regex: /\s+/, handler: handleWhitespace },

  { regex: /\./, handler: handleDefault("Dot", ".") },
  { regex: /,/, handler: handleDefault("Comma", ",") },
  { regex: /:/, handler: handleDefault("Colon", ":") },

  { regex: /'/, handler: handleDefault("Quotation", "'") },
  { regex: /"/, handler: handleDefault("Quotation", '"') },

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

type LexerTrace = {
  line: number;
  pos: number;
};

type LexerPattern = {
  regex: RegExp;
  handler: (lex: Lexer, regex: RegExp) => void;
};

export interface ILexer {
  trace: LexerTrace;
  source: string;
  tokens: Array<Token>;
  patterns: Array<LexerPattern>;
}

export class Lexer implements ILexer {
  trace: LexerTrace;

  source: string;

  tokens: Array<Token>;

  patterns: Array<LexerPattern>;

  public constructor(source: string) {
    this.source = source;

    this.patterns = lexerPatterns;

    this.tokens = new Array<Token>();

    this.trace = {
      pos: 0,
      line: 1,
    };
  }

  private createToken(value: string = "", type: TokenType): Token {
    return { value, type };
  }

  public advancePos(n: number) {
    this.trace.pos += n;
  }

  public srcAfterPos() {
    return this.source.slice(this.trace.pos);
  }

  tokenize(): Array<Token> {
    while (!this.eof()) {
      let realToken = false;

      for (const { regex, handler } of this.patterns) {
        const loc = regex.exec(this.srcAfterPos())?.index;

        if (loc === 0) {
          handler(this, regex);
          realToken = true;
          break;
        }
      }

      if (!realToken)
        raise(
          `:: Lexer Error -> Unrecognized token at ${this.trace.line}:${this.trace.pos} => ${this.srcAfterPos()}`,
        );
    }

    this.tokens.push({ type: "EOF", value: "EOF" });
    return this.tokens;
  }

  private eof() {
    return this.trace.pos >= this.source.length;
  }
}
