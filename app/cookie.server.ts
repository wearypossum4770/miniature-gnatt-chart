import { MAX_AGE, SEVEN_DAYS } from "@/utilities/index";
import { type CookieOptions, createCookie } from "@remix-run/node"; // or cloudflare/deno

export const userPrefs = createCookie("user-prefs", { maxAge: SEVEN_DAYS });

export const defineCookie = (sessionSecret?: string, environment?: string): CookieOptions => ({
	httpOnly: true,
	path: "/",
	maxAge: MAX_AGE,
	sameSite: "strict",
	secrets: [sessionSecret ?? ""],
	secure: environment === "production",
});
