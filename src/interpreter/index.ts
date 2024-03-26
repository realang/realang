import {
  BinaryExpression,
  Identifier,
  NULL,
  NumberValue,
  NumericLiteral,
  ObjectLiteral,
  ObjectValue,
  Program,
  RuntimeValue,
  Statement,
  VariableAssignmentExpression,
  VariableDeclaration,
} from "../util";
import Scope from "./scope";

export default class Interpreter {
  public eval(astNode: Statement, scope: Scope): RuntimeValue {
    switch (astNode.type) {
      case "VariableDeclaration":
        return this.evalVariableDeclaration(
          astNode as VariableDeclaration,
          scope,
        );

      case "VariableAssignmentExpression":
        return this.evalVariableAssignment(
          astNode as VariableAssignmentExpression,
          scope,
        );

      case "Identifier":
        return this.evalIdentifier(astNode as Identifier, scope);

      case "NumericLiteral":
        return {
          value: (astNode as NumericLiteral).value,
          type: "number",
        } as NumberValue;

      case "ObjectLiteral":
        return this.evalObjectExpression(astNode as ObjectLiteral, scope);

      case "BinaryExpression":
        return this.evalBinaryExpression(astNode as BinaryExpression, scope);

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

  private evalBinaryExpression(
    exp: BinaryExpression,
    scope: Scope,
  ): RuntimeValue {
    const lhs = this.eval(exp.lhs, scope);
    const rhs = this.eval(exp.rhs, scope);

    if (lhs.type != "number" || rhs.type != "number") return NULL();

    return this.evalNumericBinaryExpression(
      lhs as NumberValue,
      rhs as NumberValue,
      exp.operator,
    );
  }

  private evalNumericBinaryExpression(
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

  private evalVariableDeclaration(
    arg0: VariableDeclaration,
    scope: Scope,
  ): RuntimeValue {
    const value = arg0.value ? this.eval(arg0.value, scope) : NULL();
    return scope.declareVariable(arg0.identifier, value, arg0.isConstant);
  }

  private evalVariableAssignment(
    node: VariableAssignmentExpression,
    scope: Scope,
  ): RuntimeValue {
    if (node.assignee.type !== "Identifier") {
      console.error(
        `Expected an identifier for re-assignment. Instead got ${node.assignee.type}`,
      );
      process.exit(1);
    }

    return scope.assignVariable(
      (node.assignee as Identifier).symbol,
      this.eval(node.value, scope),
    );
  }

  private evalObjectExpression(obj: ObjectLiteral, scope: Scope): RuntimeValue {
    const object: ObjectValue = {
      type: "object",
      properties: new Map<string, RuntimeValue>(),
    };

    for (const { key, value } of obj.properties) {
      const runtimeValue = value
        ? this.eval(value, scope)
        : scope.lookupVariable(key);
      object.properties.set(key, runtimeValue);
    }

    return object;
  }
}
