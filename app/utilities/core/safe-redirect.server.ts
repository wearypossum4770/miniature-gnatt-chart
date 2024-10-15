"use server";
import { DEFAULT_REDIRECT } from "@/utilities/core/config";
// https://github.com/sergiodxa/remix-utils/blob/main/src/server/respond-to.ts
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
	const trimmed = to.trim();
	if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\") || trimmed.includes(".."))
		return defaultRedirect;

	return to ?? DEFAULT_REDIRECT;
}
