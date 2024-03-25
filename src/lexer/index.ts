import { Token, TokenType, Tokens, checkDatatype } from "../util";

export default class Lexer {
  private tokens = new Array<Token>();

  private createToken(value: string = "", type: TokenType): Token {
    return { value, type };
  }

  tokenize(srcString: string): Token[] {
    const src = srcString.split("");
    while (src.length > 0) {
      if (src[0] == undefined) return [];
      switch (src[0]) {
        case "=":
          this.tokens.push(this.createToken(src.shift(), "Equals"));
        case "(":
          this.tokens.push(this.createToken(src.shift(), "OpenParenthesis"));
          break;
        case ")":
          this.tokens.push(this.createToken(src.shift(), "CloseParenthesis"));
          break;

        case "{":
          this.tokens.push(this.createToken(src.shift(), "OpenBrace"));
          break;
        case "}":
          this.tokens.push(this.createToken(src.shift(), "CloseBrace"));
          break;

        case "[":
          this.tokens.push(this.createToken(src.shift(), "OpenBracket"));
          break;
        case "]":
          this.tokens.push(this.createToken(src.shift(), "CloseBracket"));
          break;

        case '"':
          this.tokens.push(this.createToken(src.shift(), "Quotation"));
          break;
        case "'":
          this.tokens.push(this.createToken(src.shift(), "Quotation"));
          break;

        case "+":
        case "-":
        case "*":
        case "/":
        case "%":
          this.tokens.push(this.createToken(src.shift(), "BinaryOperator"));
          break;

        default:
          if (checkDatatype(src[0], "integer")) {
            let num = "";
            while (src.length > 0 && checkDatatype(src[0], "integer")) {
              num += src.shift();
            }

            this.tokens.push(this.createToken(num, "Number"));
          } else if (checkDatatype(src[0], "alphabet")) {
            let identifier = "";

            while (src.length > 0 && checkDatatype(src[0], "alphabet")) {
              identifier += src.shift();
            }

            const reserved = Tokens.Keywords[identifier];

            reserved == undefined
              ? this.tokens.push(this.createToken(identifier, "Identifier"))
              : this.tokens.push(this.createToken(identifier, reserved));
          } else if (checkDatatype(src[0], "whitespace")) {
            src.shift();

            // check for skull emoji
          } else if (src[0] == "\ud83d" || src[0] == "\udc80") {
            src.shift();
          } else {
            console.error("Invalid character" + src[0]);
            process.exit(1);
          }
          break;
      }
    }

    this.tokens.push(this.createToken("EndOfFile", "EOF"));
    return this.tokens;
  }
}
