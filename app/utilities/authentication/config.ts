export class PermissionDenied extends Error {
	constructor() {
		super("The user did not have permission to do that");
	}
}
// DoesNotExist
export class UserDoesNotExist extends Error {
	constructor() {
		super("the requested user does not exist");
	}
}

export enum EncryptionAlgorithm {
	Unknown = 0,
	Bcrypt = 1,
	ApacheMd5 = 2,
	Sha1 = 3,
	ApacheCrypt = 4,
}

export const selectEncryptionAlgorithm = (
	hash: string,
): EncryptionAlgorithm => {
	if (hash.startsWith("$apr1$")) return EncryptionAlgorithm.ApacheMd5;
	if (hash.startsWith("$2y$")) return EncryptionAlgorithm.Bcrypt;
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
	hashPassword(): string;
};
export type UnauthenticatedUser = PrivateUserManager & UserManager;

export type AuthenticatedUser = AnonymousUser & UserManager & {};
// promoteToSuperuser
// promoteToStaff
// checkPassword
// checkLogin
// updateLastLogin
