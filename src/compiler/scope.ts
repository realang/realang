import { BOOL, NULL, RuntimeValue } from "../util";

export const initGlobalScope = () => {
  const scope = new Scope();

  scope.declareVariable("cap", BOOL(false), true);
  scope.declareVariable("null", NULL(), true);

  return scope;
};

export default class Scope {
  private parent?: Scope;
  private variables: Map<string, RuntimeValue>;
  private constants: Set<string>;

  constructor(parent?: Scope) {
    this.parent = parent;
    this.variables = new Map();
    this.constants = new Set();
  }

  public lookupVariable(name: string): RuntimeValue {
    console.log(this.variables);
    return this.resolve(name).variables.get(name)!;
  }

  public declareVariable(
    name: string,
    value: RuntimeValue,
    isConstant: boolean,
  ): RuntimeValue {
    console.log(name, value, isConstant);
    if (this.variables.has(name)) {
      console.error(`'${name}' is already defined!`);
      process.exit(1);
    }
    this.variables.set(name, value);
    if (isConstant) this.constants.add(name);
    return value;
  }

  public assignVariable(name: string, value: RuntimeValue): RuntimeValue {
    if (this.constants.has(name)) {
      console.error(`Cannot re-assign constant entity ${name}!`);
      process.exit(1);
    }
    const scope = this.resolve(name);
    scope.variables.set(name, value);

    return value;
  }

  public resolve(name: string): Scope {
    if (this.variables.has(name)) return this;

    if (this.parent == undefined) {
      console.error(`'${name}' could not be resolved as it does not exist!`);
      process.exit(1);
    }

    return this.parent.resolve(name);
  }
}
