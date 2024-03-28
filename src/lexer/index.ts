import { Token, TokenType, Tokens, checkDatatype } from "../util";

export default class Lexer {
  private tokens = new Array<Token>();

  private createToken(value: string = "", type: TokenType): Token {
    return { value, type };
  }

  tokenize(srcString: string): Token[] {
    const src = srcString.replaceAll("💀", ";").split("");
    while (src.length > 0) {
      if (src[0] == undefined) return [];
      switch (src[0]) {
        case ".":
          this.tokens.push(this.createToken(src.shift(), "Dot"));
          break;
        case ",":
          this.tokens.push(this.createToken(src.shift(), "Comma"));
          break;
        case ":":
          this.tokens.push(this.createToken(src.shift(), "Colon"));
          break;
        case ";":
          this.tokens.push(this.createToken(src.shift(), "Semicolon"));
          break;
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

            if (reserved == undefined) {
              this.tokens.push(this.createToken(identifier, "Identifier"));
            } else {
              if (identifier == "thinks") {
                identifier += " ";
                src.shift();
                while (src.length > 0 && checkDatatype(src[0], "alphabet")) {
                  identifier += src.shift();
                }
                if (identifier.split(" ")[1] !== "hes") {
                  console.error(
                    "Incomplete token! Expected 'hes' after 'thinks'",
                  );
                  process.exit(1);
                }
              } else if (identifier == "hes") {
                console.error(
                  "Incomplete token! Expected 'thinks' before 'hes'",
                );
                process.exit(1);
              } else if (identifier == "better") {
                identifier += " ";
                src.shift();
                while (src.length > 0 && checkDatatype(src[0], "alphabet")) {
                  identifier += src.shift();
                }
                if (identifier.split(" ")[1] !== "be") {
                  console.error(
                    "Incomplete token! Expected 'be' after 'better'",
                  );
                  process.exit(1);
                }
              } else if (identifier == "be") {
                console.error(
                  "Incomplete token! Expected 'better' before 'be'",
                );
                process.exit(1);
              } else if (identifier == "bro") {
                identifier += " ";
                src.shift();
                while (src.length > 0 && checkDatatype(src[0], "alphabet")) {
                  identifier += src.shift();
                }
                identifier += " ";
                src.shift();
                while (src.length > 0 && checkDatatype(src[0], "alphabet")) {
                  identifier += src.shift();
                }
                if (identifier !== "bro really said") {
                  console.error("Incomplete print token!");
                  process.exit(1);
                }
              }

              this.tokens.push(this.createToken(identifier, reserved));
            }
          } else if (checkDatatype(src[0], "whitespace")) {
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
