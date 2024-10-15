export type TypedArray =
  | Uint8Array
  | Int8Array
  | Uint8ClampedArray
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

export type DateTimeLike = string | Date | number;

export const isDateGuard = (value: unknown): value is Date => value instanceof Date;

export const isNumberGuard = (value: unknown): value is number => typeof value === "number" || value instanceof Number;

export const isStringGuard = (value: unknown): value is string => typeof value === "string";

export const isBooleanGuard = (value: unknown): value is boolean => typeof value === "boolean";

export const isBigIntGuard = (value: unknown): value is bigint => typeof value === "bigint";

export const isSymbolGuard = (value: unknown): value is symbol => typeof value === "symbol";

export const isNullGuard = (value: unknown): value is null => value === null;

export const isFunctionGuard = (value: unknown): value is CallableFunction => typeof value === "function";

export const isAsyncFunctionGuard = <T>(value: unknown): value is (...args: unknown[]) => Promise<T> =>
  isFunctionGuard(value) && value.constructor.name === "AsyncFunction";

export const isGeneratorFunctionGuard = (value: unknown): value is GeneratorFunction =>
  isFunctionGuard(value) && value.constructor.name === "GeneratorFunction";

export const isMapGuard = <T, U>(value: unknown): value is Map<T, U> => value instanceof Map;

export const safeNumberGuard = (value: unknown): value is number => !Number.isNaN(value);

export const isSetGuard = <T>(value: unknown): value is Set<T> => value instanceof Set;

export const isBufferGuard = (value: unknown): value is Buffer => value instanceof Buffer;

export const isAsyncGeneratorFunctionGuard = (value: unknown): value is AsyncGeneratorFunction =>
  isFunctionGuard(value) && value.constructor.name === "AsyncGeneratorFunction";

export const isIterableGuard = <T>(value: Iterable<T>): value is Iterable<T> =>
  value !== null && typeof value[Symbol.iterator] === "function";

export const isDateValid = (value: unknown): value is number =>
  canConvertToDate(value) && safeNumberGuard(new Date(value).getTime());

export const safeDateOrTimestamp = (value?: DateTimeLike): Date => {
  if (value instanceof Date) return value;
  switch (typeof value) {
    case "bigint":
    case "number":
    case "string":
      return new Date(value);
    default:
      return new Date();
  }
};

export const isArray = <T>(value: unknown): value is T[] => Array.isArray(value);

export const canConvertToDate = (value: unknown): value is string | Date | number =>
  isStringGuard(value) || isNumberGuard(value) || isDateGuard(value);

export type Selectable<T> = Record<string, boolean | T | null | string>;

export const getObjectValue = <T, K extends keyof T>(obj: T, key: K): T[K] | null => obj[key] ?? null;

export type ServerFunctionArgs<T, K extends keyof T> = (obj: T, key: K) => Promise<T[K]>;

export type ComponentProps = {
  children: React.ReactNode;
};

export const identity = <T>(arg: T): T => arg;

export const merge = <T, S>(target: T, source: S): T & S => ({
  ...target,
  ...source,
});

export const getProperty = <T, K extends keyof T = keyof T>(target: T, key: K) => target[key];

export const oneOf = <Key, Value>(collection: Set<Key> | Map<Key, Value>, item: Key): boolean => collection.has(item);
