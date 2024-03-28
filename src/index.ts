import { readFileSync } from "fs";
import Interpreter from "./interpreter";
import { initGlobalScope } from "./interpreter/scope";
import Parser from "./parser";

import readline from "readline";

const parser = new Parser();
const interpreter = new Interpreter();
const scope = initGlobalScope();

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

    const program = parser.createAST(input);

    interpreter.eval(program, scope);

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
  const program = parser.createAST(src);

  interpreter.eval(program, scope);
};

main();
