import {
  BinaryExp,
  Identifier,
  NULL,
  NumberValue,
  NumericLiteral,
  Program,
  RuntimeValue,
  Statement,
} from "../util";
import Scope from "./scope";

export default class Interpreter {
  public eval(astNode: Statement, scope: Scope): RuntimeValue {
    switch (astNode.type) {
      case "Identifier":
        return this.evalIdentifier(astNode as Identifier, scope);

      case "NumericLiteral":
        return {
          value: (astNode as NumericLiteral).value,
          type: "number",
        } as NumberValue;

      case "BinaryExp":
        return this.evalBinaryExp(astNode as BinaryExp, scope);

      case "Program":
        return this.evalProgram(astNode as Program, scope);

      default:
        console.error("Invalid AST Node", astNode);
        process.exit(1);
    }
  }

  private evalProgram(program: Program, scope: Scope): RuntimeValue {
    let lastEvaluated: RuntimeValue = NULL();

    for (const statement of program.body) {
      lastEvaluated = this.eval(statement, scope);
    }

    return lastEvaluated;
  }

  private evalIdentifier(identifier: Identifier, scope: Scope): RuntimeValue {
    return scope.lookupVariable(identifier.symbol);
  }

  private evalBinaryExp(exp: BinaryExp, scope: Scope): RuntimeValue {
    const lhs = this.eval(exp.lhs, scope);
    const rhs = this.eval(exp.rhs, scope);

    if (lhs.type != "number" || rhs.type != "number") return NULL();

    return this.evalNumericBinaryExp(
      lhs as NumberValue,
      rhs as NumberValue,
      exp.operator,
    );
  }

  private evalNumericBinaryExp(
    lhs: NumberValue,
    rhs: NumberValue,
    operator: string,
  ): NumberValue {
    let res = 0;

    if (operator == "+") {
      res = lhs.value + rhs.value;
    } else if (operator == "-") {
      res = lhs.value - rhs.value;
    } else if (operator == "*") {
      res = lhs.value * rhs.value;
    } else if (operator == "/") {
      res = lhs.value / rhs.value;
    } else if (operator == "%") {
      res = lhs.value % rhs.value;
    } else {
      console.error("Unknown Binary Operator", operator);
    }

    return { type: "number", value: res } as NumberValue;
  }
}
