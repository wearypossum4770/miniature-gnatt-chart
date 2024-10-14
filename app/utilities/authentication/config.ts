export type HashDriverAlgorithms = "argon2id" | "argon2d" | "argon2i" | "script" | "bcrypt";

export type DatabaseAttribution = {
  dateCreated?: Date | string | number;
  dateModified?: Date | string | number;
};

export enum EncryptionAlgorithm {
  Unknown = 0,
  Bcrypt = 1,
  ApacheMd5 = 2,
  Sha1 = 3,
  ApacheCrypt = 4,
  ArgonHybrid = 5,
  ArgonDependent = 6,
  ArgonIndependent = 7,
  PasswordBasedKey = 8,
  Scrypt = 9,
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
  PreAuthorization = 4,
}

export enum AllowedRoles {
  Admin = 0,
  SuperAdmin = 1,
  Owner = 2,
}

export const hasRole = (roles: AllowedRoles): boolean => false;

export type AbstractBaseUser = {
  username: string;
  email: string;
};

export type BaseUser = {
  password: string;
};

export type UserRegistration = BaseUser &
  AbstractBaseUser &
  DatabaseAttribution & {
    firstName: string;
    middleName?: string;
    lastName: string;
  };

export type UserCredentials = BaseUser & {
  hash: string;
};

export type UserAnonymity = {
  isAnonymous: boolean;
  type: UserType;
};

export type AnonymousUser = UserAnonymity;

export type RegisteredUser = UserRegistration &
  UserAnonymity & {
    dateJoined: Date | string | number;
    lastLogin?: Date | string | number;
  };

export type PreRegisteredUser = BaseUser & {
  username: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
};

export type UserModelBase = {
  isAuthenticated: boolean;
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
  Email = 0,
}
export type AuthenticationOptions = {
  provider: StaticAuthenticationProvider | AuthenticationProviderEnum;
};
export type HashDriverSelection = {
  hashDriver?: HashDriverAlgorithms;
  hash?: string;
};
