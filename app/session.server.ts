import { redis } from "@/cache.server";
import { defineCookie } from "@/cookie.server";
import { generateTimestamp, isWithinExpirationDate } from "@/utilities/calendar/config";
import { ONE_HOUR_MILLISECONDS, SEVEN_DAYS, USER_EXPIRATION_KEY, USER_SESSION_KEY } from "@/utilities/index";
import { ensureEnvVar } from "@/utilities/index";
import { createCookieSessionStorage, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { cacheRateLimitCheck } from "@/cache.server";
import { type User, getUserById } from "~/models/user.server";
import { RateLimitExceededError } from "@/utilities/error-handlers";

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

type CookieHeader = Awaited<ReturnType<typeof sessionStorage.destroySession | typeof sessionStorage.commitSession>>;
export class CookieExpirationError extends Error {
  constructor({ notAfter }: CookieController) {
    super(`The cookie for this session has expired. Expiration Date: ${notAfter}`);
  }
}
// ================================================================
//
// ================================================================
export const setupSessionStorage = (sessionSecret?: string, env?: string) =>
  createCookieSessionStorage<CookieController, SessionFlashData>({
    cookie: { name: "__session", ...defineCookie(sessionSecret, env) },
  });

export const sessionStorage = setupSessionStorage(process.env.SESSION_SECRET, process.env.NODE_ENV);

export const headerAddressNames = new Set([
  "Fly-Client-IP",
  "CF-Connecting-IP",
  "X-Client-IP",
  "X-Forwarded-For",
  "HTTP-X-Forwarded-For",
  "Fastly-Client-Ip",
  "True-Client-Ip",
  "X-Real-IP",
  "X-Cluster-Client-IP",
  "X-Forwarded",
  "Forwarded-For",
  "Forwarded",
  "DO-Connecting-IP" /** Digital ocean app platform */,
  "oxygen-buyer-ip" /** Shopify oxygen platform */,
]);

export const setCookieHeader = (cookieValue: CookieHeader) => ({
  headers: { "Set-Cookie": cookieValue },
});

export const getHeaderCookie = ({ headers }: Request) => headers.get("Cookie");

export const getSessionInformation = (request: Request) => sessionStorage.getSession(getHeaderCookie(request));

export const getSession = async (request: Request) => getSessionInformation(request);

export const getClientAddress = ({ headers }: Request) =>
  headers.get("Fly-Client-IP") ?? headers.get("x-forwarded-for") ?? headers.get("X-Forwarded-For");

const respectRateLimit = () => {};

const cacheStash = ({ userId, notAfter }: CookieController) => redis.hset(userId, { userId, notAfter });

export const checkCache = async (args: LoaderFunctionArgs) => {
  const { success } = await cacheRateLimitCheck(args);
  if (!success) throw new RateLimitExceededError();
  return true;
};

export const setSession = async (userId: string, session: SessionController) => {
  const notAfter = new Date(Date.now() + ONE_HOUR_MILLISECONDS);
  await Promise.allSettled([
    cacheStash({ userId, notAfter }),
    session.set(USER_SESSION_KEY, userId),
    session.set(USER_EXPIRATION_KEY, notAfter),
  ]);
  return session;
};

export const isFutureDate = (timestamp: number): boolean => timestamp > Date.now();

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

export async function requireUserId(request: Request, redirectTo?: string) {
  const url = new URL(request.url).pathname;
  const userId = await getUserId(request);
  if (userId) return userId;
  throw redirect(`/login?${new URLSearchParams([["redirectTo", (url || redirectTo) ?? ""]])}`);
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export const setUserSession = (session: SessionController) => {};

export async function createUserSession({ request, userId, remember, redirectTo }: SessionAttributes) {
  const session = await setSessionInformation({ request, userId });
  return redirect(
    redirectTo ?? "/",
    setCookieHeader(
      await sessionStorage.commitSession(session, {
        maxAge: remember ? SEVEN_DAYS : ONE_HOUR_MILLISECONDS,
      }),
    ),
  );
}

export const unsetUserSession = (session: SessionController) =>
  Promise.allSettled([session.unset(USER_SESSION_KEY), session.unset(USER_EXPIRATION_KEY)]);

export const destroySession = async (request: Request) => getSession(request).then(unsetUserSession);

export async function logout(request: Request) {
  const session = await getSession(request);
  //   await destroySession(request);
  return redirect("/", setCookieHeader(await sessionStorage.destroySession(session)));
}
