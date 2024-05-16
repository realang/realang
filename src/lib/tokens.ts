export /*const*/ enum TokenType { // TODO: change to const
  /* Datatypes */
  Number,
  String,
  Identifier,

  /* Reserved Keywords */
  Let,
  Const,
  Assignment,
  Function,
  Record,
  If,
  Else,
  Print,
  FunctionCall,
  Throw,

  ExplicitType,
  ArrayType,

  Dot,
  Comma,
  Colon,
  Quotation,
  OpenBrace,
  CloseBrace,
  OpenBracket,
  CloseBracket,
  OpenParenthesis,
  CloseParenthesis,

  Plus,
  Minus,
  Multiply,
  Divide,
  Modular,

  Equals,
  Greater,
  GreaterEquals,
  Less,
  LessEquals,

  And,
  Or,
  Not,

  Comment,

  EOF,
  EOL,
  FunctionCallEnd,
}

export const Keywords = {
  if: TokenType.If,
  else: TokenType.Else,
  is: TokenType.Const,
  rn: TokenType.FunctionCallEnd,
  fr: TokenType.EOL,
  and: TokenType.And,
  or: TokenType.Or,
  no: TokenType.Not,
  record: TokenType.Record,

  thinks: TokenType.Let,
  hes: TokenType.Let,

  "of type": TokenType.ExplicitType,
  Array: TokenType.ArrayType,

  better: TokenType.Assignment,
  be: TokenType.Assignment,

  bro: TokenType.Print,
  really: TokenType.Print,
  said: TokenType.Print,

  unreal: TokenType.Comment,
  yo: TokenType.FunctionCall,
  real: TokenType.Function,
  yowtf: TokenType.Throw,
} as const;

const Chars = {
  ".": TokenType.Dot,
  ",": TokenType.Comma,
  ":": TokenType.Colon,
  '"': TokenType.Quotation,

  "(": TokenType.OpenParenthesis,
  ")": TokenType.CloseParenthesis,
  "{": TokenType.OpenBrace,
  "}": TokenType.CloseBrace,
  "[": TokenType.OpenBracket,
  "]": TokenType.CloseBracket,

  "+": TokenType.Plus,
  "-": TokenType.Minus,
  "*": TokenType.Multiply,
  "/": TokenType.Divide,
  "%": TokenType.Modular,

  "<": TokenType.Less,
  "<=": TokenType.LessEquals,
  ">": TokenType.Greater,
  ">=": TokenType.GreaterEquals,
  "=": TokenType.Equals,
} as const;

export const Tokens = {
  Keywords,
  Chars,
} as const;
