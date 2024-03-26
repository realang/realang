import Lexer from "../lexer";
import {
  BinaryExpression,
  Expression,
  Identifier,
  NumericLiteral,
  ObjectLiteral,
  Program,
  Property,
  Statement,
  Token,
  TokenType,
  TokenTypes,
  VariableAssignmentExpression,
  VariableDeclaration,
} from "../util";

export default class Parser {
  private tokens = new Array<Token>();

  public createAST(srcString: string): Program {
    this.tokens = new Lexer().tokenize(srcString);
    // console.log("-------------------- AST --------------------\n", this.tokens);
    // console.log("\n---------------------------------------------");

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

  private next(): Token {
    return this.tokens[1] as Token;
  }

  private advance(): Token {
    return this.tokens.shift() as Token;
  }

  private expect(type: TokenType, err: string) {
    const prev = this.tokens.shift() as Token;
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
   * Assignment Expression
   */

  private parseStatement(): Statement {
    switch (this.at().type) {
      // case "Number":
      // case "String":
      case "Identifier":
        return this.parseIdentifier();
      // case "Let":
      // case "Const":

      // return this.parseVariableDeclaration();
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

  private parseIdentifier(): Expression {
    if (this.next().type == "Const") {
      return this.parseVariableDeclaration(true);
    } else if (this.next().type == "Let") {
      return this.parseVariableDeclaration(false);
    } else {
      // console.error("Not implemented yet!");
      // process.exit(1);
      return this.parseExpression();
    }
  }

  private parseExpression(): Expression {
    return this.parseVariableAssignmentExpression();
  }

  private parseAdditiveExpression(): Expression {
    let lhs = this.parseMultiplicativeExpression();

    while (this.at().value == "+" || this.at().value == "-") {
      const operator = this.advance().value;
      const rhs = this.parseMultiplicativeExpression();

      lhs = {
        type: "BinaryExpression",
        lhs,
        rhs,
        operator,
      } as BinaryExpression;
    }

    return lhs;
  }

  private parseMultiplicativeExpression(): Expression {
    let lhs = this.parsePrimaryExpression();

    while (["*", "/", "%"].includes(this.at().value)) {
      const operator = this.advance().value;
      const rhs = this.parsePrimaryExpression();

      lhs = {
        type: "BinaryExpression",
        lhs,
        rhs,
        operator,
      } as BinaryExpression;
    }

    return lhs;
  }

  private parsePrimaryExpression(): Expression {
    const token = this.at().type;

    switch (token) {
      case "Identifier":
        return {
          type: "Identifier",
          symbol: this.advance().value,
        } as Identifier;

      case "Number":
        return {
          type: "NumericLiteral",
          value: parseFloat(this.advance().value),
        } as NumericLiteral;

      case "OpenParenthesis":
        this.advance();
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

  private parseVariableDeclaration(isConstant: boolean): Statement {
    const identifier = this.expect(
      "Identifier",
      "Expected identifier name after declaration keyword.",
    ).value;

    if (this.at().type == "Semicolon") {
      this.advance();
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

    this.advance();
    const value = this.parseExpression();
    const declaration: VariableDeclaration = {
      type: "VariableDeclaration",
      value,
      identifier,
      isConstant,
    };

    this.expect(
      "Semicolon",
      "Variable declaration statment must end with '💀'.",
    );
    return declaration;
  }

  private parseVariableAssignmentExpression(): Expression {
    const lhs = this.parseObjectExpression();

    if (this.at().type == "Assignment") {
      this.advance();
      const rhs = this.parseVariableAssignmentExpression();

      const exp: VariableAssignmentExpression = {
        type: "VariableAssignmentExpression",
        assignee: lhs,
        value: rhs,
      };
      return exp;
    }

    return lhs;
  }

  private parseObjectExpression(): Expression {
    if (this.at().type !== "OpenBrace") {
      return this.parseAdditiveExpression();
    }

    this.advance();

    const properties = new Array<Property>();

    while (!this.isEOF() && this.at().type !== "CloseBrace") {
      const key = this.expect("Identifier", "Expected key for property").value;

      if (this.at().type === "Comma" || this.at().type === "CloseBrace") {
        if (this.at().type === "Comma") this.advance();

        properties.push({
          type: "Property",
          key,
        });
        continue;
      }

      this.expect("Colon", "Expected ':' after key");

      const value = this.parseExpression();

      properties.push({
        type: "Property",
        key,
        value,
      });
      if (this.at().type !== "CloseBrace") {
        this.expect("Comma", "Unexpected end of Object literal");
      }
    }

    this.expect("CloseBrace", "Expected Object literal to end");

    const exp: ObjectLiteral = {
      type: "ObjectLiteral",
      properties,
    };

    return exp;
  }
}
