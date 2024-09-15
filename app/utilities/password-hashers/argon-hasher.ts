import { hash, verify } from "@node-rs/argon2";

import type {
  BaseUser,
  PrivateUserManager,
  UnauthenticatedUser,
} from "@/utilities/authentication/config";
import { safePassword } from "@/utilities/password-hashers/config";

export enum ArgonAlgorithm {
  IndependentHash = 0,
  DependentHash = 1,
  HybridHash = 2,
}

export enum ArgonVersion {
  version0x10 = 0,
  /**
   * Default value
   * Version 19 (0x13 in hex, default)
   */
  version0x13 = 1,
}

export const hashPassword = async ({
  password,
}: Pick<BaseUser, "password">): Promise<string | null> => {
  "use server";
  const pword = safePassword(password);
  if (typeof pword === "string") return hash(pword.normalize("NFKC"));
  return null;
};

export const verifyPassword = async ({
  password,
  hash,
}: UnauthenticatedUser): Promise<boolean> => {
  "use server";
  const pword = safePassword(password);
  return !pword ? false : verify(hash.normalize("NFKC"), pword);
};
