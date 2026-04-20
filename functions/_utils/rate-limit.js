import { sha256Hex } from "./auth.js";

export async function checkAndIncrement(env, ipKey, scope, limit, windowSeconds) {
  if (!env.RATE_LIMIT) return { ok: true };
  const key = `rl:${scope}:${ipKey}`;
  let n = 0;
  try {
    const v = await env.RATE_LIMIT.get(key);
    n = v ? parseInt(v, 10) || 0 : 0;
  } catch {
    return { ok: true };
  }
  if (n >= limit) return { ok: false, count: n };
  try {
    await env.RATE_LIMIT.put(key, String(n + 1), { expirationTtl: windowSeconds });
  } catch {
    // fail-open
  }
  return { ok: true, count: n + 1 };
}

export async function ipKey(request, env) {
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
  const seed = env.SESSION_SECRET || "no-secret";
  return sha256Hex(ip + ":" + seed);
}
