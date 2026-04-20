const COOKIE_NAME = "mhc_admin";
const SESSION_TTL_SECONDS = 12 * 60 * 60;
const enc = new TextEncoder();
const dec = new TextDecoder();

function b64urlEncode(bytes) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(str) {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const s = atob(str.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

async function importHmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export function constantTimeEqual(a, b) {
  const ab = typeof a === "string" ? enc.encode(a) : a;
  const bb = typeof b === "string" ? enc.encode(b) : b;
  const len = Math.max(ab.length, bb.length);
  let diff = ab.length ^ bb.length;
  for (let i = 0; i < len; i++) {
    diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return diff === 0;
}

export async function signSession(secret, ttlSeconds = SESSION_TTL_SECONDS) {
  const payload = JSON.stringify({ exp: Math.floor(Date.now() / 1000) + ttlSeconds, v: 1 });
  const key = await importHmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return b64urlEncode(enc.encode(payload)) + "." + b64urlEncode(new Uint8Array(sig));
}

export async function verifySession(secret, cookie) {
  if (!cookie || typeof cookie !== "string") return false;
  const dot = cookie.indexOf(".");
  if (dot < 1) return false;
  const payloadB64 = cookie.slice(0, dot);
  const sigB64 = cookie.slice(dot + 1);
  let payloadBytes, sigBytes;
  try {
    payloadBytes = b64urlDecode(payloadB64);
    sigBytes = b64urlDecode(sigB64);
  } catch {
    return false;
  }
  const key = await importHmacKey(secret);
  const ok = await crypto.subtle.verify("HMAC", key, sigBytes, payloadBytes);
  if (!ok) return false;
  let payload;
  try {
    payload = JSON.parse(dec.decode(payloadBytes));
  } catch {
    return false;
  }
  if (typeof payload.exp !== "number") return false;
  return payload.exp > Math.floor(Date.now() / 1000);
}

export function readCookie(request, name = COOKIE_NAME) {
  const header = request.headers.get("cookie") || "";
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq) === name) return decodeURIComponent(part.slice(eq + 1));
  }
  return null;
}

export function sessionCookie(value, maxAgeSeconds = SESSION_TTL_SECONDS) {
  return `${COOKIE_NAME}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAgeSeconds}`;
}

export function clearCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export async function sha256Hex(input) {
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function isAdmin(request, env) {
  if (!env.SESSION_SECRET) return false;
  const cookie = readCookie(request);
  if (!cookie) return false;
  return verifySession(env.SESSION_SECRET, cookie);
}
