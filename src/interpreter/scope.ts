import { RuntimeValue } from "../util";

export default class Scope {
  private parent?: Scope;
  private vars: Map<string, RuntimeValue>;

  constructor(parent?: Scope) {
    this.parent = parent;
    this.vars = new Map();
  }

  public lookupVariable(name: string): RuntimeValue {
    return this.resolve(name).vars.get(name) as RuntimeValue;
  }

  public declareVariable(name: string, value: RuntimeValue): RuntimeValue {
    if (this.vars.has(name)) {
      console.error(`'${name}' is already defined!`);
      process.exit(1);
    }
    this.vars.set(name, value);
    return value;
  }

  public assignVariable(name: string, value: RuntimeValue): RuntimeValue {
    const scope = this.resolve(name);
    scope.vars.set(name, value);

    return value;
  }

  public resolve(name: string): Scope {
    if (this.vars.has(name)) return this;

    if (this.parent == undefined) {
      console.error(`'${name}' could not be resolved as it does not exist!`);
      process.exit(1);
    }

    return this.parent.resolve(name);
  }
}
