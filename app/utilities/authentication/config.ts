export type HashDriverAlgorithms = "argon2id" | "argon2d" | "argon2i" | "script";

export enum EncryptionAlgorithm {
  Unknown,
  Bcrypt,
  ApacheMd5,
  Sha1,
  ApacheCrypt,
  ArgonHybrid,
  ArgonDependent,
  ArgonIndependent,
  PasswordBasedKey,
  Scrypt,
}

export const selectEncryptionAlgorithm = (hash: string): EncryptionAlgorithm => {
  if (hash.startsWith("scrypt")) return EncryptionAlgorithm.Scrypt;
  if (hash.startsWith("$pbkdf2-sha256$")) return EncryptionAlgorithm.PasswordBasedKey;
  if (hash.startsWith("$pbkdf2")) return EncryptionAlgorithm.PasswordBasedKey;
  if (hash.startsWith("$apr1$")) return EncryptionAlgorithm.ApacheMd5;
  if (hash.startsWith("$2y$")) return EncryptionAlgorithm.Bcrypt;
  if (hash.startsWith("$argon2d$")) return EncryptionAlgorithm.ArgonDependent;
  if (hash.startsWith("$argon2i$")) return EncryptionAlgorithm.ArgonIndependent;
  if (hash.startsWith("$argon2id$")) return EncryptionAlgorithm.ArgonHybrid;
  return EncryptionAlgorithm.Unknown;
};

export enum UserType {
  Anonymous = 0,
  Authenticated = 1,
  Unregistered = 2,
  Registered = 3,
}

export type BaseUser = {
  password: string;
};
export type PreRegisteredUser = BaseUser & {
  username: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
};
export type RegisteredUser = PreRegisteredUser & {
  dateJoined: Date | string | number;
  dateCreated: Date | string | number;
};
export type UserModelBase = {
  isAuthenticated: boolean;
  dateJoined: Date | string | number;
  lastLogin?: Date | string | number;
};

export type AnonymousUser = UserModelBase & {
  isAnonymous: boolean;
};
export type PrivateUserManager = {
  password: string;
};
export type UserManager = {
  hash: string;
};
export type UnauthenticatedUser = PrivateUserManager & UserManager;

export type AuthenticatedUser = AnonymousUser & UserManager & {};
// promoteToSuperuser
// promoteToStaff
// checkPassword
// checkLogin
// updateLastLogin
export type StaticAuthenticationProvider = "email";
export enum AuthenticationProviderEnum {
  Email,
}
export type AuthenticationOptions = {
  provider: StaticAuthenticationProvider | AuthenticationProviderEnum;
};
export type HashDriverSelection = {
  hashDriver?: HashDriverAlgorithms;
  hash?: string;
};
