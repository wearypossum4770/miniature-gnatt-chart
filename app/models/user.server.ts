import type { Password, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";
import type { UserRegistration, PreUserLogin } from "@/utilities/authentication/config";
import { hashPassword, verifyPassword } from "@/utilities/password-hashers/argon-hasher";

export type LoginFieldError = {
  password: string;
  username: string;
  email: string;
};
export type AuthenticationErrors = {
  invalidEmail?: boolean;
  minLengthPassword?: boolean;
  loginFailure?: boolean;
  invalidUsername?: boolean;
  invalidPassword?: boolean;
  emptyPassword?: boolean;
};

const userWithPasswordQuery = () => ({ include: { password: true } });

const createEmptyProject = () => ({ projects: { create: { status: "", title: "" } } });

const createEmptyPassword = (hash: string) => ({ password: { create: { hash } } });

const createEmptyNote = () => ({ notes: { create: { body: "", title: "" } } });

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
      ...createEmptyProject(),
      ...createEmptyPassword(hash),
      ...createEmptyNote(),
    },
  });
};

export const deleteUserByEmail = (email: User["email"]) => prisma.user.delete({ where: { email } });

export const deleteUserByEmailObject = ({ email }: User) => prisma.user.delete({ where: { email } });

export const getUserObjectByEmail = ({ email }: PreUserLogin) =>
  prisma.user.findUnique({
    where: { email },
    ...userWithPasswordQuery(),
  });

export const assignValidationMessages = ([statusText, fieldName, message]: string[]) => {
  return [{ [fieldName]: message }, { statusText }];
};
export const rejectAuthenticationAttempt = ({ invalidPassword }: AuthenticationErrors) => {};
export const getUserObjectByUsername = ({ username }: PreUserLogin) =>
  prisma.user.findUnique({ where: { username }, ...userWithPasswordQuery() });

export const verifyUserObjectLogin = async ({ email, username }: PreUserLogin) => {
  if (email) return getUserObjectByEmail({ email });
  if (username) return getUserObjectByUsername({ username });
};

export const verifyLogin = async (email: User["email"], password: Password["hash"]) => {
  const userWithPassword = await getUserObjectByEmail({ email });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }
  const {
    password: { hash },
  } = userWithPassword;

  const isValid = await verifyPassword({ password, hash });

  if (!isValid) throw rejectAuthenticationAttempt({ invalidPassword: !isValid });

  const { id, username } = userWithPassword;

  return { id, username, email: userWithPassword.email };
};

export const rejectAuthentication = (
  errors: LoginFieldError,
  {
    loginFailure,
    emptyPassword,
    invalidUsername,
    invalidEmail,
    minLengthPassword,
    invalidPassword,
  }: AuthenticationErrors,
) => {
  const obj = (() => {
    if (loginFailure) return ["UserCredentialsFailedToAuthenticate"];
    if (invalidUsername) return ["InvalidUsername", "username", "Is invalid, user does not exists"];
    if (invalidEmail) return ["InvalidEmailAddress", "email", "Is invalid, user does not exists"];
    if (emptyPassword) return ["PasswordEmpty", "password", "Password is required"];
    if (minLengthPassword) return ["PasswordLengthTooShort", "password", "Password is too short"];
    // "PasswordLengthTooLong"
    // "PasswordNotSaved"
    if (invalidPassword) return ["InvalidLoginCredentials", "password", "Check credentials and try again."];
    return [];
  })();
  return new InvalidCredentialExceptionResponse(obj);
};
export class InvalidCredentialExceptionResponse extends Response {
  constructor([statusText, fieldName, message]: string[]) {
    super(
      JSON.stringify({
        errorCause: "Authentication failed",
        fieldName,
        message,
      }),
      {
        statusText,
        status: 400,
      },
    );
  }
}
export class InvalidCredentialException extends Response {
  constructor({ statusText }: { statusText: string }) {
    super("Authentication failed", {
      statusText,
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="User Visible Realm"',
      },
    });
  }
}
