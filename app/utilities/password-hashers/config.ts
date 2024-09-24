import { illegalCharacters } from "@/utilities/index";

const passwordTypeGuard = (password: unknown): password is string => typeof password === "string";

const passwordEmptyGuard = (password: string): password is string => password.trim().length > 0;

const passwordEncodingGuard = (password: string): password is string => {
  if (!password.isWellFormed()) return false;
  for (const char of password) {
    if (illegalCharacters.has(char)) return false;
  }
  return true;
};

export const safePassword = (password: unknown): string | null | Buffer => {
  // order matters as we are type narrowing here. Do not change order.
  if (!passwordTypeGuard(password) || !passwordEmptyGuard(password) || !passwordEncodingGuard(password)) return null;
  return password;
};

export const upgradeInsecureHashAlgorithms = (password: string, upgrade: boolean) => {
  if (!upgrade) return null;
  return password;
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
