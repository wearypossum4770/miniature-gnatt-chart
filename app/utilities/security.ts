import { randomBytes } from "node:crypto";
import { CHALLENGE_LENGTH, CHALLENGE_OVERFLOW, DEFAULT_REDIRECT, SALT_LENGTH, SALT_OVERFLOW } from "@/utilities/index";
import { createId, init } from "@paralleldrive/cuid2";
import { redirect } from "@remix-run/node";

export type MaybeLength = {
  length?: number;
};

export const generateCuid = async (): Promise<string> => createId();

export const generateCuidFromObject = async ({ length }: MaybeLength): Promise<string> =>
  init({
    length: typeof length === "number" && length < SALT_OVERFLOW ? length : SALT_LENGTH,
  })();

export const generateRandomChallenge = async (size?: number): Promise<Buffer> =>
  randomBytes(typeof size === "number" && size < CHALLENGE_OVERFLOW ? size : CHALLENGE_LENGTH);

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== "string") return defaultRedirect;
  if (!to.startsWith("/") || to.startsWith("//")) return defaultRedirect;
  return to;
}

export const preventBackNavigation = () => {};
export const antiClickjack = () => {
  if (self!== top) return null;

  const antiClickjack = document.getElementById("antiClickjack") as HTMLElement;
  if (antiClickjack instanceof HTMLElement) return antiClickjack.parentNode?.removeChild(antiClickjack);
  return (top.location === self.location);

};

export const setCsrfToken = ({ headers }: Request) => headers.set("X-XSRF-TOKEN", "");
export const redirectInsecureTraffic = ({ headers }: Request) => {
  if (headers.get("x-forwarded-proto") !== "https") {
    redirect;
  }
};
export type CorsPolicy = {
  allowedHeaders: string[];
  origin: string;
  methods: string[];
};
export const corsPolicyEnforcement = (headers: Headers) => {
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  headers.set("X-Frame-Options", "deny");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Permitted-Cross-Domain-Policies", "none");
  headers.set("Referrer-Policy", "no-referrer");
  // headers.set('Clear-Site-Data', '"cache","cookies","storage"')
  headers.set("Cross-Origin-Embedder-Policy", "require-corp");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Resource-Policy", "same-origin");
  headers.set("Cache-Control", "no-store, max-age=0");
};
// ({ allowedHeaders, methods, origin }: CorsPolicy) => {};
