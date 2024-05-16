import { readFileSync } from "fs";
import util from "util";
import { Parser } from "./parser";

import readline from "readline";
import { Lexer } from "./lexer";
import Interpreter from "./compiler";
import Scope from "./compiler/scope";
import { TokenType } from "./lib/tokens";

const repl = async () => {
  console.log("\nReal Repl (v0.0.1)");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const prompt = (query: string) => {
    return new Promise((resolve) => rl.question(query, resolve));
  };
  while (true) {
    let input = (await prompt("> ")) as string;

    if (input.includes("exit")) {
      process.exit(0);
    }

    if (!input.endsWith("fr")) input += " fr"; // FIXME: temp solution, it sucks

    const lexer = new Lexer(input);
    const tokens = lexer.tokenize();

    const parser = new Parser(tokens);
    const ast = parser.parse();
    /*console.log(
      util.inspect(ast, { showHidden: false, depth: null, colors: true })
    );*/
    const interpreter = new Interpreter();

    console.log(interpreter.transpile(ast));

    rl.on("close", () => process.exit(0));
  }
};

const main = async () => {
  const path = process.argv[2];
  if (!path) {
    await repl();
    return;
  }
  const src = readFileSync(path, "utf-8");

  const lexer = new Lexer(src);
  const tokens = lexer.tokenize();

  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  // const globalScope = new Scope();
  console.log(interpreter.transpile(ast));
  console.log(
    util.inspect(ast, { showHidden: false, depth: null, colors: true })
  );
  return;
};

main();
