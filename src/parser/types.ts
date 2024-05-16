import { Parser } from ".";
import { TokenType } from "../lib/tokens";
import { ArrayType, SymbolType, Type } from "../types/types.types";
import { raise } from "../util";
import { BindingPower, BindingPower } from "./lookups";

export type TypeNudHandler = (parser: Parser) => Type;
export type TypeLedHandler = (
  parser: Parser,
  lhs: Type,
  bp: BindingPower,
) => Type;

export const typeBpLookup = new Map<TokenType, BindingPower>();
export const typeLedLookup = new Map<TokenType, TypeLedHandler>();
export const typeNudLookup = new Map<TokenType, TypeNudHandler>();

export const typeLed = (
  type: TokenType,
  bp: BindingPower,
  handler: TypeLedHandler,
) => {
  typeBpLookup.set(type, bp);
  typeLedLookup.set(type, handler);
};

export const typeNud = (type: TokenType, handler: TypeNudHandler) => {
  typeNudLookup.set(type, handler);
};

export const createTypeLookups = () => {
  typeNud(TokenType.Identifier, parseSymbolType);
  typeNud(TokenType.ArrayType, parseArrayType);
};

export const parseSymbolType = (parser: Parser) => {
  const type: SymbolType = {
    type: "Symbol",
    name: parser.expect(TokenType.Identifier).value,
  };

  return type;
};

export const parseArrayType = (parser: Parser) => {
  parser.advance();

  parser.expect(TokenType.Less);

  const base = parseType(parser, BindingPower.default);

  parser.expect(TokenType.Greater);
  const type: ArrayType = {
    type: "Array",
    base,
  };

  return type;
};

export const parseType = (parser: Parser, bp: BindingPower): Type => {
  const typeNudHandler = typeNudLookup.get(parser.currentToken.type);

  if (!typeNudHandler) {
    raise(
      `:: Internal Error -> No handler found for TYPE_NUD expression: ${parser.currentToken.value} [${parser.currentToken.type}]`,
    );
    return {} as Type; // ! Unreachable
  }

  let lhs = typeNudHandler(parser);

  while (
    typeBpLookup.get(parser.currentToken.type) ??
    BindingPower.default > bp
  ) {
    const typeLedHandler = typeLedLookup.get(parser.currentToken.type);

    if (!typeLedHandler) {
      raise(
        `:: Internal Error -> No handler found for TYPE_LED expression: ${parser.advance()}`,
      );
      return {} as Type; // ! Unreachable
    }

    lhs = typeLedHandler(
      parser,
      lhs,
      typeBpLookup.get(parser.currentToken.type) ?? BindingPower.default,
    );
  }

  return lhs;
};
