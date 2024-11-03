import { isDocumentDefined, isUndefined, isWindowDefined } from "@/utilities/validations/assertions";
import invariant from "tiny-invariant";
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

type AcceptableFiles = {
  [mimeType: string]: string[];
};
interface FilePickerTypes {
  description?: string;
  accept: AcceptableFiles;
}
interface FilePickerOptions {
  excludeAcceptAllOption?: boolean;
  id?: string;
  multiple?: boolean;
  startIn?: string;
  types?: FilePickerTypes[];
}
// START SPECIFICATION
export type CookieStoreGetOptions = {
  name: string;
  url: string | URL;
};
export type CookieStoreInit = {
  name: string;
  value: string;
  expires?: DOMHighResTimeStamp;
  domain?: string;
  path?: string;
  sameSite: CookieSameSite;
  partitioned: boolean;
};
export type CookieStoreDeleteOptions = {
  name: string;
  domain?: string;
  path: string;
  partitioned: boolean;
};
export type CookieStoreListItem = {
  name: string;
  value: string;
  domain?: string;
  path: string;
  expires?: DOMHighResTimeStamp;
  secure: boolean;
  sameSite: CookieSameSite;
  partitioned: boolean;
};
export type CookieStoreList = Iterable<CookieStoreListItem>;
// END SPECIFICATION
export type CookieInit = CookieJar & CookieCrumble;
export type CookieSecurity = "" | "silent" | "strict" | "unsafe-disabled";
export type SecureCookiePrefix = "__Secure-" | "__Host-" | "";
export enum CookieSameSite {
  Strict = "strict",
  Lax = "lax",
  Disabled = "none",
}
export type CookieSameSiteStates = "" | "strict" | "lax" | "none";

export type CookiePriority = "" | "low" | "medium" | "high";

export type ToughCookie = {
  httpOnly: Nullable<boolean>;
  secure?: boolean;
  maxAge: Nullable<number>;
  prefix: Nullable<SecureCookiePrefix>;
};

export type SoftCookie = {
  sameSite: CookieSameSite | boolean;
  path?: string;
  partitioned?: boolean;
  expires?: DOMHighResTimeStamp | Date;
  domain?: string;
};

export type CookieCrumble = {
  name: string;
  value: string;
};

export type CookieJar = ToughCookie & SoftCookie & CookieCrumble & {};

export interface CookieStore {
  set(details: CookieInit): Promise<undefined>;
}
export type CookieBox = CookieJar & {
  priority?: CookiePriority;
};

export type CookieOptions = {
  prefixSecurity: CookieSecurity;
  ignoreError: boolean;
};

export type CookieCreationReturn = {
  hasError: boolean;
  hash: string;
  ignoreError: CookieOptions["ignoreError"];
};

declare global {
  interface Window {
    /**
     *  Available only in secure contexts.
     * @description shows a file picker, allowing a user to select a file or multiple files.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker}
     * @param { object } init
     * @param { boolean } init.excludeAcceptAllOption -
     * @param { string } init.id - primary key for directories, state kept across operations.
     * @param { boolean } init.multiple - allows user to select multiple fles.
     * @param { string } init.startIn - the directory to open the dialog in.
     * @param { FilePickerTypes[] } init.types - allowed files
     * @throws { AbortError } user selected a sensitive or dangerous file or dismissed the prompt without making a selection
     * @throws { TypeError } accept types cannot be processed.
     * @throws { SecurityError } action was not called via user interaction, or blocked by [same-origin-policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
     * @returns { Promise<FileSystemFileHandle[]> }
     */
    showOpenFilePicker: (init?: FilePickerOptions) => Promise<FileSystemFileHandle[]>;
    /**
     *  [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/CookieStore)
     */
    cookieStore: CookieStore;
  }
}
export default {};
/**
 * The inverse of NonNullable<T>.
 */
export type HeaderInit = Array<[string, string | number | boolean]>;
export type Nullable<T> = T | null | undefined;
export const noop = (args: never) => void args;
export const BASIC_AUTHORIZATION = Symbol.for("BASIC_AUTHORIZATION");
export const SALT_LENGTH_KEY = Symbol.for("SALT_LENGTH");
export const MAX_TOKEN_AGE_KEY = Symbol.for("MAX_TOKEN_AGE");

export const RATE_LIMITER_INTERVAL_MS = 60_000;
export const MAX_PINGS_PER_INTERVAL = 40;
export const USER_SESSION_KEY = "userId";
export const USER_EXPIRATION_KEY = "notAfter";
export const DEFAULT_REDIRECT = "/";

export const HOURLY_MAX_CACHE_CHECK_LIMIT = 30;

export const SALT_LENGTH = 10;
export const CHALLENGE_LENGTH = 64;
export const USERNAME_LENGTH = 32;
export const MAX_OTP = 999_999_999;
export const MIN_OTP = 100_000;

export const SALT_OVERFLOW = 60;
export const CHALLENGE_OVERFLOW = 400;

export const ONE_DAY = 86_400;
export const HALF_DAY = ONE_DAY / 2;
export const ONE_HOUR_MILLISECONDS = 3_600_000;
export const SEVEN_DAYS = 604_800;
export const ONE_DAY_MILLISECONDS = 86_400_000;
export const ONE_HOUR_SECONDS = 60_000;
export const MAX_AGE = ONE_DAY;

export const MAX_ALLOWED_COOKIE_TIME = 2_147_483_647_000;

export const NULL_UUID = "00000000-0000-0000-0000-000000000000";
export const CONTROL_CHARS = /[\u{00}-\u{1F}]/u;
// biome-ignore format: the array should not be formatted
// prettier-ignore
export const illegalCharacters = new Set<string>([
	"\u2009", "\u2008", "\u2007", "\u2003", "\u2002",
	"\u2001", "\u2006", "\u2005", "\u2004", "\u2000",
	"\u200E", "\u200F", "\u00AD", "\u200A", "\u200B",
	"\uFEFF", "\u2060", "\u200D", "\u200C",
]);

export const ensureEnvVar = async (envar: unknown, errorMessage?: string) =>
  typeof envar === "string" ? invariant(envar, errorMessage ?? "") : null;

export class InvalidDateException extends Error {
  constructor(date: unknown) {
    super(
      `Analysis of the value given for the date: "${date}", determined it was invalid. Please correct and try again.`,
    );
  }
}

export enum RateLimiterState {
  Incrementing = 0,
  Throttled = 1,
}
export function isSessionInactive(sessionLengthInMinutes = 30) {
  const lastActive = localStorage.getItem("glean_session_last_active");
  const lastActiveDate = new Date(Number(lastActive));
  const inactiveThreshold = new Date();
  inactiveThreshold.setMinutes(inactiveThreshold.getMinutes() - sessionLengthInMinutes);
  return inactiveThreshold > lastActiveDate;
}
export const summation = (arr: number[]): number => arr.reduce<number>((accum, curr) => accum + curr, 0);
export const getMonotonicNow = () => Math.round(typeof performance === "undefined" ? Date.now() : performance.now());

export const hasRequestAnimationFrame = () => isWindowDefined && typeof window.requestAnimationFrame !== "undefined";
export function getCurrentTimeInNanoSeconds() {
  if (typeof process === "undefined") return getMonotonicNow();
  const [first, second] = process.hrtime();
  return first * 1_000_000_000 + second;
}
export const IS_SERVER = !(typeof document !== "undefined") || "Deno" in window;
export const navigatorConnectionGuard = (value: unknown): value is NetworkInformation => "connection" in navigator;
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

export const safeOrigin = (): URL => new URL(window.location.href, window.location.origin);

export class QuotaExceededError extends Error {}
export class ReadOnlyError extends Error {}
export class NotAllowedError extends Error {}
export const chainableHeader = () => {};
