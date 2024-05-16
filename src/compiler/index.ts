import { ArrayType, SymbolType, Type } from "../types/types.types";
import {
  ArrayLiteral,
  BinaryExpression,
  BlockStatement,
  Expression,
  ExpressionStatement,
  FunctionCallExpression,
  FunctionDeclaration,
  Identifier,
  IfStatement,
  NumericLiteral,
  ObjectLiteral,
  PrintExpression,
  Program,
  Statement,
  StringLiteral,
  VariableAssignmentExpression,
  VariableDeclarationExpression,
} from "../util";

export default class Compiler {
  transpile(astNode: Statement | Expression): string {
    switch (astNode.type) {
      case "Block":
        return this.transpileBlock(astNode as BlockStatement);
      case "Expression":
        return this.transpile((astNode as ExpressionStatement).expression);
      case "VariableDeclaration":
      case "VariableAssignment":
        return this.transpileVariableDeclaration(
          astNode as
            | VariableDeclarationExpression
            | VariableAssignmentExpression
        );
      case "Identifier":
        return this.transpileIdentifier(astNode as Identifier);
      case "NumericLiteral":
        return `${(astNode as NumericLiteral).value}`;
      case "StringLiteral":
        return `"${(astNode as StringLiteral).value}"`;
      case "ArrayLiteral":
        return `[${(astNode as ArrayLiteral).value
          .map((v) => this.transpile(v))
          .join(", ")}]`;
      case "ObjectLiteral":
        return this.transpileObjectLiteral(astNode as ObjectLiteral);
      case "FunctionDeclaration":
        return this.transpileFunctionDeclaration(
          astNode as FunctionDeclaration
        );
      case "FunctionCallExpression":
        return this.transpileFunctionCall(astNode as FunctionCallExpression);
      case "BinaryExpression":
        return this.transpileBinaryExpression(astNode as BinaryExpression);
      case "PrintExpression":
        return this.transpilePrintExpression(astNode as PrintExpression);
      case "IfCondition":
        return this.transpileIfStatement(astNode as IfStatement);
      case "Program":
        return this.transpileProgram(astNode as Program);
      default:
        throw new Error(`Unknown AST Node type: ${astNode.type}`);
    }
  }

  private transpileBlock(block: BlockStatement) {
    return `{ ${block.body
      .map((statement) => this.transpile(statement))
      .join(" ")} }`;
  }

  private transpileIdentifier(identifier: Identifier) {
    return identifier.value;
  }

  private transpileVariableDeclaration(
    declaration: VariableDeclarationExpression | VariableAssignmentExpression
  ) {
    const init = declaration.value
      ? ` = ${this.transpile(declaration.value)}`
      : "";
    return `${
      declaration.type == "VariableDeclaration" && declaration.explicitType
        ? `/** @type {${declaration.explicitType.type}${
            "base" in (declaration.explicitType as ArrayType)
              ? `<${
                  ((declaration.explicitType as ArrayType).base as SymbolType)
                    .name
                }>`
              : ""
          }} */ `
        : ""
    }${
      declaration.type == "VariableAssignment"
        ? ""
        : declaration.isConstant
        ? "const "
        : "let "
    }${
      (
        declaration[
          (declaration.type == "VariableAssignment"
            ? "assignee"
            : "identifier") as keyof typeof declaration
        ] as Identifier
      ).value
    }${init};`;
  }

  private transpileObjectLiteral(object: ObjectLiteral) {
    const properties = object.value.map(
      ({ key, value }) => `${key}: ${this.transpile(value)}`
    );
    return `{ ${properties.join(", ")} }`;
  }

  private transpileFunctionDeclaration(func: FunctionDeclaration) {
    const params = func.params.join(", ");
    const body = func.body.map((stmt) => this.transpile(stmt)).join(" ");
    return `function ${func.name}(${params}) ${body}`;
  }

  private transpileFunctionCall(call: FunctionCallExpression) {
    const callee = this.transpile(call.callee);
    const args = call.args.map((arg) => this.transpile(arg)).join(", ");
    return `${callee}(${args})`;
  }

  private transpileBinaryExpression(expression: BinaryExpression) {
    const lhs = this.transpile(expression.lhs);
    const rhs = this.transpile(expression.rhs);
    return `(${lhs} ${expression.operator.value} ${rhs})`;
  }

  private transpilePrintExpression(expression: PrintExpression) {
    const args = expression.args.map((arg) => this.transpile(arg)).join(", ");
    return `console.log(${args});`;
  }

  private transpileIfStatement(statement: IfStatement) {
    const condition = this.transpile(statement.condition);
    const body = statement.body.map((stmt) => this.transpile(stmt)).join(" ");
    const alternate = statement.orElse ? this.transpile(statement.orElse) : "";
    return `if (${condition}) ${body} ${alternate ? `else ${alternate}` : ""}`;
  }

  private transpileProgram(program: Program) {
    return program.body
      .map((statement) => this.transpile(statement))
      .join("\n");
  }
}
