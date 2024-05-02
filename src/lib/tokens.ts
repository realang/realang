export const TokenTypes = {
  /* Datatypes */
  Number: "Number",
  String: "String",
  Identifier: "Identifier",

  /* Reserved Keywords */

  Let: "Let",
  Const: "Const",
  Reassign: "Reassign",
  Function: "Function",
  If: "If",
  Else: "Else",
  Print: "Print",
  FunctionCall: "FunctionCall",
  Throw: "Throw",

  Dot: "Dot",
  Comma: "Comma",
  Colon: "Colon",
  Quotation: "Quotation",
  OpenBrace: "OpenBrace",
  CloseBrace: "CloseBrace",
  OpenBracket: "OpenBracket",
  CloseBracket: "CloseBracket",
  OpenParenthesis: "OpenParenthesis",
  CloseParenthesis: "CloseParenthesis",

  Plus: "Plus",
  Minus: "Minus",
  Multiply: "Multiply",
  Divide: "Divide",
  Modular: "Modular",

  Equals: "Equals",
  Greater: "Greater",
  GreaterEquals: "GreaterEquals",
  Less: "Less",
  LessEquals: "LessEquals",

  And: "And",
  Or: "Or",
  Not: "Not",

  Comment: "Comment",

  EOF: "EOF",
  EOL: "EOL",
  FunctionCallEnd: "FunctionCallEnd",
} as const;

export const Keywords = {
  if: TokenTypes.If,
  else: TokenTypes.Else,
  is: TokenTypes.Const,
  const: TokenTypes.Const,
  rn: TokenTypes.FunctionCallEnd,
  fr: TokenTypes.EOL,
  and: TokenTypes.And,
  or: TokenTypes.Or,
  no: TokenTypes.Not,

  better: TokenTypes.Reassign,
  be: TokenTypes.Reassign,

  bro: TokenTypes.Print,
  really: TokenTypes.Print,
  said: TokenTypes.Print,

  unreal: TokenTypes.Comment,
  yo: TokenTypes.FunctionCall,
  real: TokenTypes.Function,
  yowtf: TokenTypes.Throw,
} as const;

const Chars = {
  ".": TokenTypes.Dot,
  ",": TokenTypes.Comma,
  ":": TokenTypes.Colon,
  '"': TokenTypes.Quotation,

  "(": TokenTypes.OpenParenthesis,
  ")": TokenTypes.CloseParenthesis,
  "{": TokenTypes.OpenBrace,
  "}": TokenTypes.CloseBrace,
  "[": TokenTypes.OpenBracket,
  "]": TokenTypes.CloseBracket,

  "+": TokenTypes.Plus,
  "-": TokenTypes.Minus,
  "*": TokenTypes.Multiply,
  "/": TokenTypes.Divide,
  "%": TokenTypes.Modular,

  "<": TokenTypes.Less,
  "<=": TokenTypes.LessEquals,
  ">": TokenTypes.Greater,
  ">=": TokenTypes.GreaterEquals,
  "=": TokenTypes.Equals,
} as const;

export const Tokens = {
  Keywords,
  Chars,
} as const;