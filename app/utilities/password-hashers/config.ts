// biome-ignore format: the array should not be formatted
// prettier-ignore
export const illegalCharacters = new Set<string>([
	"\u2009", "\u2008", "\u2007", "\u2003", "\u2002",
	"\u2001", "\u2006", "\u2005", "\u2004", "\u2000",
	"\u200E", "\u200F", "\u00AD", "\u200A", "\u200B",
	"\uFEFF", "\u2060", "\u200D", "\u200C",
]);
export const SALT_LENGTH = 10;
const passwordTypeGuard = (password: unknown): password is string =>
  typeof password === "string";

const passwordEmptyGuard = (password: string): password is string =>
  password.trim().length > 0;

const passwordEncodingGuard = (password: string): password is string => {
  if (!password.isWellFormed()) return false;
  for (const char of password) {
    if (illegalCharacters.has(char)) return false;
  }
  return true;
};

export const safePassword = (password: unknown): string | null | Buffer => {
  // order matters as we are type narrowing here. Do not change order.
  if (
    !passwordTypeGuard(password) ||
    !passwordEmptyGuard(password) ||
    !passwordEncodingGuard(password)
  )
    return null;
  return password;
};

export const upgradeInsecureHashAlgorithms = (
  password: string,
  upgrade: boolean,
) => {
  if (!upgrade) return null;

  if (password.startsWith("$apr1$")) return EncryptionAlgorithm.ApacheMd5;
  if (password.startsWith("$2y$")) return EncryptionAlgorithm.Bcrypt;
  if (password.startsWith("$2x$")) return EncryptionAlgorithm.Bcrypt;
  return EncryptionAlgorithm.Unknown;
};
export enum EncryptionAlgorithm {
  Unknown = 0,
  Bcrypt = 1,
  ApacheMd5 = 2,
  Sha1 = 3,
  ApacheCrypt = 4,
  Argon2d = 5,
  Argon2i = 6,
  Argon2id = 7,
}

export const selectEncryptionAlgorithm = (
  hash: string,
): EncryptionAlgorithm => {
  if (hash.startsWith("$apr1$")) return EncryptionAlgorithm.ApacheMd5;
  if (hash.startsWith("$2y$")) return EncryptionAlgorithm.Bcrypt;
  return EncryptionAlgorithm.Unknown;
};
export interface UnregisteredUser {
  password: string;
}
export type BaseUser = {
  id: string;
  email: string;
  username: string;
  password: string;
  usernameIsEmail: boolean;
};
export type UnauthenticatedUser = {
  password: string;
  upgradeInsecureHash: boolean;
  username: string;
  hash: string;
};
export type AuthenticatedUser = Omit<BaseUser, "password" | "usernameIsEmail">;
