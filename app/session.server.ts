import { ONE_HOUR_MILLISECONDS, SEVEN_DAYS, USER_SESSION_KEY, USER_EXPIRATION_KEY } from "@/utilities/index";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { ensureEnvVar } from "@/utilities/index";
import { type User, getUserById } from "~/models/user.server";
import { defineCookie } from "@/cookie.server";
import { generateTimestamp, isWithinExpirationDate } from "@/utilities/calendar/config";
import { redis } from "@/cache.server";
ensureEnvVar(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

type CookieContext = {
  notAfter: Date | string | number;
};
type UserContext = {
  userId: string;
};
type SessionContext = UserContext & {
  request: Request;
};
type CookieController = UserContext & CookieContext;
type SessionController = Awaited<ReturnType<typeof getSession>>;

type SessionAttributes = SessionContext & {
  remember: boolean;
  redirectTo?: string;
};
type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

export class CookieExpirationError extends Error {
  constructor({ notAfter }: CookieController) {
    super(`The cookie for this session has expired. Expiration Date: ${notAfter}`);
  }
}
export const setupSessionStorage = (sessionSecret?: string, env?: string) =>
  createCookieSessionStorage<CookieController, SessionFlashData>({
    cookie: { name: "__session", ...defineCookie(sessionSecret, env) },
  });

export const sessionStorage = setupSessionStorage(process.env.SESSION_SECRET, process.env.NODE_ENV);

export const getHeaderCookie = ({ headers }: Request) => headers.get("Cookie");

export const getSessionInformation = (request: Request) => sessionStorage.getSession(getHeaderCookie(request));

export const getSession = async (request: Request) => getSessionInformation(request);

const cacheStash = ({ userId, notAfter }: CookieController) => redis.hset(userId, { userId, notAfter });
export const setSession = async (userId: string, session: SessionController) => {
  const notAfter = new Date(Date.now() + ONE_HOUR_MILLISECONDS);
  await Promise.allSettled([
    cacheStash({ userId, notAfter }),
    session.set(USER_SESSION_KEY, userId),
    session.set(USER_EXPIRATION_KEY, notAfter),
  ]);
  return session;
};

// export const saveSession = (session: SessionController)
export const commitSession = () => sessionStorage.commitSession;

export const setSessionInformation = ({ request, userId }: SessionContext) =>
  getSession(request).then((session) => setSession(userId, session));

export const getDestructuredUserId = (request: Request): Promise<CookieController> =>
  getSession(request)
    .then((session) => ({
      userId: session.get(USER_SESSION_KEY),
      notAfter: session.get(USER_EXPIRATION_KEY),
    }))
    .catch((e) => e);

export const userIdFromCookie = ({ userId }: CookieController) => userId;

export const getUserId = async (request: Request): Promise<User["id"] | undefined> =>
  await getDestructuredUserId(request).then(userIdFromCookie);

export const isCookieExpired = ({ notAfter }: CookieController): boolean => isWithinExpirationDate(notAfter);

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
  const userId = await getUserId(request);
  if (userId) return userId;
  throw redirect(`/login?${new URLSearchParams([["redirectTo", redirectTo]])}`);
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}
export const setUserSession = (session: ReturnType<typeof getSession>) => {};
export async function createUserSession({ request, userId, remember, redirectTo }: SessionAttributes) {
  const session = await setSessionInformation({ request, userId });
  return redirect(redirectTo ?? "/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember ? SEVEN_DAYS : ONE_HOUR_MILLISECONDS,
      }),
    },
  });
}

export const unsetUserSession = (session: SessionController) =>
  Promise.allSettled([session.unset(USER_SESSION_KEY), session.unset(USER_EXPIRATION_KEY)]);

export const destroySession = async (request: Request) => getSession(request).then(unsetUserSession);

export async function logout(request: Request) {
  const session = await getSession(request);
  //   await destroySession(request);

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
