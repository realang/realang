import Lexer from "../lexer";
import {
  BinaryExpression,
  Expression,
  FunctionCallExpression,
  FunctionDeclaration,
  Identifier,
  MemberExpression,
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
   * Assignment Expression
   * Object Expression
   * Additive Expression
   * Multiplication Expression
   * Call Expression
   * Member Expression
   * Primary Expression
   */

  private parseStatement(): Expression {
    switch (this.at().type) {
      // case "Number":
      // case "String":
      case "Identifier":
        return this.parseIdentifier();
      case "Function":
        return this.parseFunctionDeclaration();
      // case "If":
      // case "Else":
      // case "Print":
      //   return this.parsePrint();
      case "FunctionCall":
        return this.parseCallMemberExpression();
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

  private parseFunctionDeclaration(): Expression {
    this.advance(); // go past 'real'
    const name = this.expect(
      "Identifier",
      "Expected function name after declaration keyword.",
    ).value;
    const args = this.parseArgs();

    args.forEach((param) => {
      if (param.type !== "Identifier") {
        console.error(
          `Expected parameter ${param} to be an identifier (in function ${name})`,
        );
      }
    });

    const params = args.map((arg) => (arg as Identifier).symbol);

    this.expect("OpenBrace", "Expected '{' after function declaration");

    const body: Statement[] = [];

    while (!this.isEOF() && this.at().type != TokenTypes.CloseBrace) {
      body.push(this.parseStatement());
    }
    this.expect("CloseBrace", "Expected function body to close");

    const fn: FunctionDeclaration = {
      type: "FunctionDeclaration",
      name,
      body,
      params,
    };

    return fn;
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
    let lhs = this.parseCallMemberExpression();
    // let lhs = this.parsePrimaryExpression();

    while (["*", "/", "%"].includes(this.at().value)) {
      const operator = this.advance().value;
      const rhs = this.parseCallMemberExpression();
      // const rhs = this.parsePrimaryExpression();

      lhs = {
        type: "BinaryExpression",
        lhs,
        rhs,
        operator,
      } as BinaryExpression;
    }

    return lhs;
  }

  private parseCallMemberExpression(): Expression {
    const [member, isCallExp] = this.parseMemberExpression();

    if (isCallExp) {
      return this.parseCallExpression(member);
    }

    return member;
  }

  private parseCallExpression(callee: Expression): Expression {
    let exp: Expression = {
      type: "FunctionCallExpression",
      callee,
      args: this.parseArgs(),
    } as FunctionCallExpression;

    if (this.at().type == "FunctionCall") {
      exp = this.parseCallExpression(exp);
    }

    return exp;
  }

  private parseMemberExpression(): [Expression, boolean] {
    let isCallExp: boolean = false;

    if (this.at().type == "FunctionCall") {
      this.advance();
      isCallExp = true;
    }
    let obj = this.parsePrimaryExpression();

    // if (isCallExp) {
    //   return this.parseCallExpression(obj);
    // }

    while (this.at().type == "Dot" || this.at().type == "OpenBracket") {
      const operator = this.advance();
      let property: Expression;
      let computed: boolean;

      if (operator.type == "Dot") {
        computed = false;
        property = this.parsePrimaryExpression();

        if (property.type != "Identifier") {
          console.error("Property is not an identifier");
          process.exit(1);
        }
      } else {
        computed = true;
        property = this.parseExpression();

        this.expect("CloseBracket", "Missing closing bracket");
      }

      obj = {
        type: "MemberExpression",
        object: obj,
        property,
        computed,
      } as MemberExpression;
    }
    return [obj, isCallExp];
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

  private parseVariableDeclaration(isConstant: boolean): Expression {
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

  private parseArgs(): Expression[] {
    const args = this.at().type == "Semicolon" ? [] : this.parseArgsList();

    this.expect("Semicolon", "Missing '💀' after function call expression.");

    return args;
  }

  private parseArgsList(): Expression[] {
    const args = [this.parseVariableAssignmentExpression()];

    while (!this.isEOF() && this.at().type != "Semicolon") {
      args.push(this.parseVariableAssignmentExpression());
    }

    return args;
  }

  // private parsePrint(): Expression {
  //   if (this.at().type !== "Print")
  //     return this.parseVariableAssignmentExpression();
  //   this.advance(); // advace past print token
  //   const args = this.parseArgs();
  //   console.log(...args);
  //   process.exit(1);
  //   // return {} as Expression;
  // }
}
