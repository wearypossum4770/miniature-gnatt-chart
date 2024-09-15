import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";
import type {
	BaseUser,
	PreRegisteredUser,
	PrivateUserManager,
	UnauthenticatedUser,
} from "@/utilities/authentication/config";
import { hashPassword } from "@/utilities/password-hashers/argon-hasher";
export async function getUserById(id: User["id"]) {
	return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
	return prisma.user.findUnique({ where: { email } });
}

export const createUser = async ({
	username,
	password,
	email,
}: PreRegisteredUser) => {
	const hash = await hashPassword({ password });
	if (hash === null) return { id: null };
	return prisma.user.create({
		data: { username, email, password: { create: { hash } } },
	});
};

export async function deleteUserByEmail(email: User["email"]) {
	return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
	email: User["email"],
	password: Password["hash"],
) {
	const userWithPassword = await prisma.user.findUnique({
		where: { email },
		include: {
			password: true,
		},
	});

	if (!userWithPassword || !userWithPassword.password) {
		return null;
	}

	const isValid = await bcrypt.compare(
		password,
		userWithPassword.password.hash,
	);

	if (!isValid) {
		return null;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password: _password, ...userWithoutPassword } = userWithPassword;

	return userWithoutPassword;
}
