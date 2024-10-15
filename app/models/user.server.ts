import type { Password, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";
import type { UserRegistration } from "@/utilities/authentication/config";
import { hashPassword, verifyPassword } from "@/utilities/password-hashers/argon-hasher";

export const getUserById = (id: User["id"]) => prisma.user.findUnique({ where: { id } });

export const getUserByIdObject = ({ id }: User) => prisma.user.findUnique({ where: { id } });

export const getUserByEmail = (email: User["email"]) => prisma.user.findUnique({ where: { email } });

export const getUserByEmailObject = ({ email }: User) => prisma.user.findUnique({ where: { email } });

export const createUser = async ({ username, password, email, firstName, middleName, lastName }: UserRegistration) => {
	const hash = await hashPassword({ password });
	if (hash === null) return { id: null };
	return prisma.user.create({
		data: {
			username,
			firstName,
			middleName,
			lastName,
			email,
			projects: { create: { status: "", title: "" } },
			password: { create: { hash } },
			notes: { create: { body: "", title: "" } },
		},
	});
};

export const deleteUserByEmail = (email: User["email"]) => prisma.user.delete({ where: { email } });

export const deleteUserByEmailObject = ({ email }: User) => prisma.user.delete({ where: { email } });

export const verifyLogin = async (email: User["email"], password: Password["hash"]) => {
	const userWithPassword = await prisma.user.findUnique({
		where: { email },
		include: {
			password: true,
		},
	});

	if (!userWithPassword || !userWithPassword.password) {
		return null;
	}
	const {
		password: { hash },
	} = userWithPassword;

	const isValid = await verifyPassword({ password, hash });

	if (!isValid) return null;

	const { createdAt, id, username, updatedAt } = userWithPassword;

	return { createdAt, updatedAt, id, username, email: userWithPassword.email };
};
