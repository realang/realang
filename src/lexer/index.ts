import { Token } from "../types";
import { raise } from "../util";
import { LexerPattern, patterns as lexerPatterns } from "./patterns";

export type Trace = {
  line: number;
  pos: number;
};

export interface ILexer {
  trace: Trace;
  source: string;
  tokens: Array<Token>;
  patterns: Array<LexerPattern>;
}

export class Lexer implements ILexer {
  trace: Trace;

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

  public tokenize(): Array<Token> {
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

  public advancePos(n: number) {
    this.trace.pos += n;
  }

  public srcAfterPos() {
    return this.source.slice(this.trace.pos);
  }

  private eof() {
    return this.trace.pos >= this.source.length;
  }
}
