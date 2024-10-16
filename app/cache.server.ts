import { singleton } from "@/singleton.server";
import { ensureEnvVar } from "@/utilities/index";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getClientIpAddress } from '@/utilities/analytics/server-actions.server'
import { LoaderFunctionArgs } from "@remix-run/node";
ensureEnvVar(process.env.UPSTASH_REDIS_REST_URL, "");
ensureEnvVar(process.env.UPSTASH_REDIS_REST_TOKEN, "");
const cache = new Map(); // must be outside of your serverless function handler

const controller = new AbortController();
const { abort } = controller;
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

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
      limiter: Ratelimit.slidingWindow(1, "10 s"),
    }),
);
export const cacheRateLimitCheck = async ({ request }: LoaderFunctionArgs) => {
  const { clientId } = getClientIpAddress(request)
  const { success,  } = await ratelimit.limit(clientId)
  return { clientId, success}
}
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
