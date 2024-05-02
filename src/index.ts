import { readFileSync } from "fs";
import Interpreter from "./interpreter";
import { initGlobalScope } from "./interpreter/scope";
import { Parser } from "./parser";

import readline from "readline";
import { Lexer } from "./lexer";

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
    const input = (await prompt("> ")) as string;

    if (input.includes("exit")) {
      process.exit(0);
    }

    const lexer = new Lexer(input);
    const tokens = lexer.tokenize();

    const parser = new Parser(tokens);
    const ast = parser.parse();

    const interpreter = new Interpreter();
    const scope = initGlobalScope();

    interpreter.eval(ast, scope);

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

  console.log(ast);
  return;

  const interpreter = new Interpreter();
  const scope = initGlobalScope();

  // interpreter.eval(ast, scope);
};

main();
