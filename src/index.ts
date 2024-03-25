import Interpreter from "./interpreter";
import Scope from "./interpreter/scope";
import Parser from "./parser";

import readline from "readline";
import { NUM, NumberValue } from "./util";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const prompt = (query: string) =>
  new Promise((resolve) => rl.question(query, resolve));

const repl = async () => {
  const parser = new Parser();
  const scope = new Scope();
  scope.declareVariable("x", NUM(50));

  console.log("\nReal Repl (v0.0.1)");
  while (true) {
    const input = (await prompt("> ")) as string;

    if (!input || input.includes("exit")) {
      process.exit(0);
    }

    const program = parser.createAST(input);

    const res = new Interpreter().eval(program, scope);
    console.log(res);
  }
};

repl();

rl.on("close", () => process.exit(0));
