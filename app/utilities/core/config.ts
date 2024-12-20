export const BASIC_AUTHORIZATION = Symbol.for("BASIC_AUTHORIZATION");

export const SALT_LENGTH = Symbol.for("10");

export const MAX_TOKEN_AGE = Symbol.for("MAX_TOKEN_AGE");

export const RATE_LIMITER_INTERVAL_MS = 60_000;

export const MAX_PINGS_PER_INTERVAL = 40;

export const DEFAULT_REDIRECT = "/";
export const DEFAULT_STATUS_CODE = 200;

export enum RateLimiterState {
  Incrementing = 0,
  Throttled = 1,
}
export type ConnectionType =
  | "bluetooth"
  | "cellular"
  | "ethernet"
  | "mixed"
  | "none"
  | "other"
  | "unknown"
  | "wifi"
  | "wimax";

export type EffectiveConnectionType = "slow-2g" | "2g" | "3g" | "4g";

export interface NetworkInformation {
  downlink: number;
  type?: ConnectionType;
  effectiveType: EffectiveConnectionType;
  rtt: number;
  downlinkMax?: number;
  saveData: boolean;
  onchange(): void;
}

export function isSessionInactive(sessionLengthInMinutes = 30) {
  const lastActive = localStorage.getItem("glean_session_last_active");
  const lastActiveDate = new Date(Number(lastActive));
  const inactiveThreshold = new Date();
  inactiveThreshold.setMinutes(inactiveThreshold.getMinutes() - sessionLengthInMinutes);
  return inactiveThreshold > lastActiveDate;
}
export const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isNaN(v);
export const isBoolean = (v: unknown): v is boolean => typeof v === "boolean";
export const isInteger = (v: unknown): v is number => isNumber(v) && Number.isInteger(v);
export const isUndefined = (v: unknown): v is undefined => typeof v === "undefined";
export const isString = (v: unknown): v is string => typeof v === "string";
export const getMonotonicNow = () => Math.round(typeof performance === "undefined" ? Date.now() : performance.now());
export const isObject = (v: unknown): v is object => isObjectLike(v) && v?.constructor?.name === "Object";
export const isObjectLike = (v: unknown): v is object => typeof v === "object" && v !== null;
export const isEmptyObject = (v: unknown): boolean => isObject(v) && Object.keys(v).length === 0;
export const isMapLike = <T, K>(v: unknown): v is Map<T, K> =>
  isObjectLike(v) && ["Map", "WeakMap"].includes(v.constructor.name);
export const isSetLike = <T>(v: unknown): v is Set<T> =>
  isObjectLike(v) && ["Set", "WeakSet"].includes(v.constructor.name);
export const isWindowObjectUnavailable = (): boolean => typeof window === "undefined";
const isWindowDefined = typeof window !== "undefined";
const isDocumentDefined = typeof document !== "undefined";
export const isFunction = (v: unknown): v is CallableFunction => typeof v === "function";
export const isPromiseLike = <T>(v: unknown): v is Promise<T> => isFunction(v) && v.constructor.name === "Promise";
export const hasRequestAnimationFrame = () => isWindowDefined && typeof window.requestAnimationFrame !== "undefined";
export function getCurrentTimeInNanoSeconds() {
  if (typeof process === "undefined") return getMonotonicNow();
  const [first, second] = process.hrtime();
  return first * 1_000_000_000 + second;
}
export const IS_SERVER = !(typeof document !== "undefined") || "Deno" in window;
export const navigatorConnectionGuard = (value: unknown): value is NetworkInformation => "connection" in navigator;
// Adjust the config based on slow connection status (<= 70Kbps).
export const slowConnection =
  !IS_SERVER &&
  navigatorConnectionGuard(navigator) &&
  (["slow-2g", "2g"].includes(navigator.effectiveType) || navigator.saveData);

export const isVisible = () => {
  const visibilityState = isDocumentDefined && document.visibilityState;
  return isUndefined(visibilityState) || visibilityState !== "hidden";
};
export const extractBooleanFromString = (v: string): boolean | null => {
  const value = v.toLocaleLowerCase();
  if (/true/i.test(value)) return true;
  if (/false/i.test(value)) return false;
  return null;
};

export type ProtectedResource<T> = {
  authenticationAttempted: boolean;
  authorizationAttempted: boolean;
  loginAttempts: number;
  isAuthenticated: boolean;
  authenticate(): Promise<T>;
  check(): Promise<boolean>;
};
