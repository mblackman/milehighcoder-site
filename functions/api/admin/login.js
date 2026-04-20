import { constantTimeEqual, signSession, sessionCookie } from "../../_utils/auth.js";
import { json, err, readJson } from "../../_utils/http.js";
import { checkAndIncrement, ipKey } from "../../_utils/rate-limit.js";

const BRUTE_LIMIT = 5;
const BRUTE_WINDOW_S = 600;

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
    return err(500, "admin not configured");
  }

  const ipk = await ipKey(request, env);
  const rl = await checkAndIncrement(env, ipk, "admin-login", BRUTE_LIMIT, BRUTE_WINDOW_S);
  if (!rl.ok) return err(429, "too many attempts");

  const body = await readJson(request);
  const password = body && typeof body.password === "string" ? body.password : "";

  if (!constantTimeEqual(password, env.ADMIN_PASSWORD)) {
    await new Promise(r => setTimeout(r, 200 + Math.random() * 300));
    return err(401, "invalid password");
  }

  const cookie = await signSession(env.SESSION_SECRET);
  return json({ ok: true }, { headers: { "set-cookie": sessionCookie(cookie) } });
}
