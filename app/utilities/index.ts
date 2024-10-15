import invariant from "tiny-invariant";

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
  }
}
export default {};
export const USER_SESSION_KEY = "userId";
export const USER_EXPIRATION_KEY = "notAfter";
export const DEFAULT_REDIRECT = "/";
export const SALT_LENGTH = 10;
export const SALT_OVERFLOW = 60;
export const CHALLENGE_LENGTH = 64;
export const USERNAME_LENGTH = 32;
export const CHALLENGE_OVERFLOW = 400;
export const ONE_DAY = 86_400;
export const HALF_DAY = ONE_DAY / 2;
export const ONE_HOUR_MILLISECONDS = 3_600_000;
export const SEVEN_DAYS = 604_800;
export const ONE_HOUR_SECONDS = 60_000;
export const MAX_AGE = ONE_DAY;
export const MAX_OTP = 999_999_999;
export const MIN_OTP = 100_000;
export const NULL_UUID = "00000000-0000-0000-0000-000000000000";
// biome-ignore format: the array should not be formatted
// prettier-ignore
export const illegalCharacters = new Set<string>([
	"\u2009", "\u2008", "\u2007", "\u2003", "\u2002",
	"\u2001", "\u2006", "\u2005", "\u2004", "\u2000",
	"\u200E", "\u200F", "\u00AD", "\u200A", "\u200B",
	"\uFEFF", "\u2060", "\u200D", "\u200C",
]);

export const ensureEnvVar = (envar: unknown, errorMessage: string) =>
  typeof envar === "string" ? invariant(envar, errorMessage) : null;

export class InvalidDateException extends Error {
  constructor(date: unknown) {
    super(
      `Analysis of the value given for the date: "${date}", determined it was invalid. Please correct and try again.`,
    );
  }
}
// let o = new URL(window.location.href,window.location.origin);
