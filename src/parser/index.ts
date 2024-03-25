import Lexer from "../lexer";
import {
  BinaryExp,
  Expression,
  Identifier,
  NumericLiteral,
  Program,
  Statement,
  Token,
  TokenType,
  TokenTypes,
  VariableDeclaration,
  checkDatatype,
} from "../util";

export default class Parser {
  private tokens = new Array<Token>();

  public createAST(srcString: string): Program {
    this.tokens = new Lexer().tokenize(srcString);

    const program: Program = {
      type: "Program",
      body: [],
    };

    while (!this.isEOF()) {
      program.body.push(this.parseStatement());
    }

    return program;
  }

  private isEOF(): boolean {
    return this.tokens[0]?.type == TokenTypes.EOF;
  }

  private at(): Token {
    return this.tokens[0] as Token;
  }

  private eat(): Token {
    return this.tokens.shift() as Token;
  }

  private expect(type: TokenType, err: string) {
    console.log(this.tokens);
    const prev = this.tokens.shift() as Token;
    console.log(this.tokens);
    if (!prev || prev.type != type) {
      console.error("[Parser] ", err, prev, " -- Expected: ", type);
      process.exit(1);
    }
    return prev;
  }

  /***
   ** - Order of Prescidence:
   * Additive Expression
   * Multiplication Expression
   * Primary Expression
   */

  private parseStatement(): Statement {
    switch (this.at().type) {
      // case "Number":
      // case "String":
      // case "Identifier":
      case "Let":
      case "Const":
        return this.parseVariableDeclaration();
      // case "Function":
      // case "If":
      // case "Else":
      // case "Print":
      // case "FunctionCall":
      // case "Throw":
      // case "Not":
      // case "Equals":
      // case "Greater":
      // case "Less":
      // case "Quotation":
      // case "Semicolon":
      // case "OpenBrace":
      // case "CloseBrace":
      // case "OpenBracket":
      // case "CloseBracket":
      // case "OpenParenthesis":
      // case "CloseParenthesis":
      // case "BinaryOperator":
      // case "Comment":
      // case "EOF":
      default:
        return this.parseExpression();
    }
  }

  private parseExpression(): Expression {
    return this.parseAdditiveExpression();
  }

  private parseAdditiveExpression(): Expression {
    let lhs = this.parseMultiplicativeExpression();

    while (this.at().value == "+" || this.at().value == "-") {
      const operator = this.eat().value;
      const rhs = this.parseMultiplicativeExpression();

      lhs = {
        type: "BinaryExp",
        lhs,
        rhs,
        operator,
      } as BinaryExp;
    }

    return lhs;
  }

  private parseMultiplicativeExpression(): Expression {
    let lhs = this.parsePrimaryExpression();

    while (["*", "/", "%"].includes(this.at().value)) {
      const operator = this.eat().value;
      const rhs = this.parsePrimaryExpression();

      lhs = {
        type: "BinaryExp",
        lhs,
        rhs,
        operator,
      } as BinaryExp;
    }

    return lhs;
  }

  private parsePrimaryExpression(): Expression {
    const token = this.at().type;

    switch (token) {
      case "Identifier":
        return { type: "Identifier", symbol: this.eat().value } as Identifier;

      case "Number":
        return {
          type: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;

      case "OpenParenthesis":
        this.eat();
        const value = this.parseExpression();
        this.expect(
          "CloseParenthesis",
          "Unexpected token. Expected closing parenthesis",
        );
        return value;

      default:
        console.error("[Parser] Unexpected token", this.at());
        process.exit(1);
    }
  }

  private parseVariableDeclaration(): Statement {
    const isConstant = this.eat().type == "Const";
    const identifier = this.expect(
      "Identifier",
      "Expected identifier name after declaration keyword.",
    ).value;

    if (checkDatatype(this.at().value, "whitespace")) {
      this.eat();
      if (isConstant) {
        console.error("Expected value when defining a constant expression!");
        process.exit(1);
      }

      const dec: VariableDeclaration = {
        type: "VariableDeclaration",
        identifier,
        isConstant,
      };
      return dec;
    }

    this.expect("Equals", "Expected '=' after identifier!");

    const declaration: VariableDeclaration = {
      type: "VariableDeclaration",
      value: this.parseExpression(),
      identifier,
      isConstant,
    };

    return declaration;
  }
}
