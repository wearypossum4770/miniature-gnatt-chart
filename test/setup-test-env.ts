const now = Date.now();

class StaticDate extends Date {
  constructor(value?: unknown) {
    switch (typeof value) {
      case "number":
        super(value);
        break;
      case "string":
        super(value);
        break;
      case "object":
        super(value instanceof Date ? value : now);
        break;
      default:
        super(now);
    }
  }
}

Object.assign(globalThis, { Date: StaticDate });
globalThis.Date.now = (): number => now;
