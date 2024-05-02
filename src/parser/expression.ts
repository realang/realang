import { Parser } from ".";
import {
  BinaryExpression,
  Expression,
  Identifier,
  NumericLiteral,
  StringLiteral,
  raise,
} from "../util";
import {
  BindingPower,
  BindingPowerTable,
  bpLookup,
  ledLookup,
  nudLookup,
} from "./lookups";

/**
 *
 * -> Order of Presidence <-
 *
 *
 */

export const parseExpression = (
  parser: Parser,
  bp: BindingPower,
): Expression => {
  const nudHandler = nudLookup.get(parser.currentToken.type);

  if (!nudHandler) {
    raise(
      `:: Internal Error -> No handler found for NUD expression: ${parser.currentToken.value} [${parser.currentToken.type}]`,
    );
    return {} as Expression; // ! Unreachable
  }

  let lhs = nudHandler(parser);

  while (
    bpLookup.get(parser.currentToken.type) ??
    BindingPowerTable.default > bp
  ) {
    const ledHandler = ledLookup.get(parser.currentToken.type);

    if (!ledHandler) {
      raise(
        `:: Internal Error -> No handler found for LED expression: ${parser.advance()}`,
      );
      return {} as Expression; // ! Unreachable
    }

    lhs = ledHandler(parser, lhs, bp);
  }

  return lhs;
};

export const parsePrimaryExpression = (parser: Parser): Expression => {
  switch (parser.currentToken.type) {
    case "Number": {
      const num = parseFloat(parser.advance().value);
      const expr: NumericLiteral = {
        type: "NumericLiteral",
        value: num,
      };

      return expr;
    }

    case "String": {
      const expr: StringLiteral = {
        type: "StringLiteral",
        value: parser.advance().value,
      };
      return expr;
    }

    case "Identifier": {
      const expr: Identifier = {
        type: "Identifier",
        value: parser.advance().value,
      };
      return expr;
    }

    default:
      raise(
        `:: Internal Error -> Unknown type for primary expression: ${parser.advance()}`,
      );
      return {} as Expression; // ! This line won't be reached
  }
};

export const parseBinaryExpression = (
  parser: Parser,
  lhs: Expression,
  bp: BindingPower,
): Expression => {
  const operator = parser.advance();

  const rhs = parseExpression(parser, bp);

  const expr: BinaryExpression = {
    type: "BinaryExpression",
    lhs,
    rhs,
    operator,
  };

  return expr;
};
