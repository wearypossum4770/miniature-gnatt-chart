import { singleton } from "@/singleton.server";
import { getClientIpAddress, type Analytics } from "@/utilities/analytics/server-actions.server";
import { ensureEnvVar, HOURLY_MAX_CACHE_CHECK_LIMIT } from "@/utilities/index";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

ensureEnvVar(url, "Upstash Redis URL not set.");
ensureEnvVar(token, "Upstash Reds token not set.");

type RatelimitResponseType = "timeout" | "cacheBlock" | "denyList";

export type CacheResponseData = Analytics & {
  success: boolean;
  reason?: RatelimitResponseType;
  deniedValue?: string;
};

const cache = new Map(); // must be outside of your serverless function handler

const controller = new AbortController();
const { abort } = controller;

const redis = singleton("redis", () => new Redis({ url, token, signal: controller.signal }));

export const abortCacheRequest = () => abort.call(controller);

export const ratelimit = singleton(
  "ratelimit",
  () =>
    new Ratelimit({
      redis,
      ephemeralCache: cache,
      timeout: 1_000,
      prefix: "ratelimit:free",
      limiter: Ratelimit.slidingWindow(5, "10 s"),
    }),
);

export const cacheRateLimitCheck = async ({ request }: LoaderFunctionArgs): Promise<CacheResponseData> => {
  const { clientId } = getClientIpAddress(request);
  const { success, reason, deniedValue } = await ratelimit.limit(clientId);
  return { clientId, success, reason, deniedValue };
};

export const setRateLimitHeader = () => ({ "X-RateLimit-Limit": HOURLY_MAX_CACHE_CHECK_LIMIT.toString() });

export const setRemainingRequestHeader = (requestCount: number) => ({
  "X-RateLimit-Remaining": String(HOURLY_MAX_CACHE_CHECK_LIMIT - requestCount),
});

export const cacheRateBusted = (requestCount: number) =>
  new Response(
    JSON.stringify({
      code: "OVER_RATE_LIMIT",
    }),
    {
      headers: new Headers(Object.assign({}, setRateLimitHeader(), setRemainingRequestHeader(requestCount))),
    },
  );

export const cacheRateLimitWrapper =
  (fn: CallableFunction) =>
  async (...args: unknown[]) => {
    try {
      return await Promise.resolve(fn(...args));
    } catch (_error) {
      return null;
    }
  };
export { redis };
