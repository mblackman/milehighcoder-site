import { json, err, readJson } from "../../_utils/http.js";
import { sha256Hex } from "../../_utils/auth.js";
import { checkAndIncrement, ipKey } from "../../_utils/rate-limit.js";
import { weightedSample } from "../../_utils/weighted.js";
import { getTagsForDreams } from "../../_utils/db.js";

const MAX_TEXT = 500;
const MAX_AUTHOR = 60;
const URL_RE = /https?:\/\//gi;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function verifyTurnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true; // local dev: skip if unset
  if (!token) return false;
  try {
    const body = new URLSearchParams();
    body.set("secret", env.TURNSTILE_SECRET);
    body.set("response", token);
    if (ip) body.set("remoteip", ip);
    const r = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body });
    if (!r.ok) return false;
    const j = await r.json();
    return j && j.success === true;
  } catch {
    return false;
  }
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  let limit = parseInt(url.searchParams.get("limit") || "50", 10);
  if (!Number.isFinite(limit) || limit <= 0) limit = 50;
  if (limit > 200) limit = 200;

  const rs = await env.DB.prepare(
    `SELECT d.id, d.text, d.author,
            COALESCE(SUM(t.weight), 1.0) AS w
     FROM dreams d
     LEFT JOIN dream_tags dt ON dt.dream_id = d.id
     LEFT JOIN tags t        ON t.name      = dt.tag_name
     WHERE d.status = 'approved'
     GROUP BY d.id`
  ).all();

  const rows = rs.results || [];
  const sampled = weightedSample(rows, limit);
  const ids = sampled.map(r => r.id);
  const tagMap = await getTagsForDreams(env, ids);

  return json({
    dreams: sampled.map(r => ({
      id: r.id,
      text: r.text,
      author: r.author,
      tags: tagMap.get(r.id) || [],
    })),
  });
}

export async function onRequestPost({ request, env }) {
  // Same-origin check: block cross-site automated POSTs.
  const origin = request.headers.get("origin");
  if (origin) {
    const url = new URL(request.url);
    const expected = `${url.protocol}//${url.host}`;
    if (origin !== expected) return err(403, "bad origin");
  }

  const body = await readJson(request);
  if (!body || typeof body !== "object") return err(400, "invalid body");

  // Honeypot — pretend success.
  if (body.website && String(body.website).trim().length > 0) {
    return json({ ok: true, id: 0 }, { status: 201 });
  }

  let text = typeof body.text === "string" ? body.text.trim() : "";
  let author = typeof body.author === "string" ? body.author.trim() : "";

  if (!text) return err(400, "text required");
  if (text.length > MAX_TEXT) return err(400, "text too long");
  if (author.length > MAX_AUTHOR) return err(400, "author too long");
  const urlCount = (text.match(URL_RE) || []).length;
  if (urlCount > 5) return err(400, "too many urls");

  const ip = request.headers.get("cf-connecting-ip") || "";
  const ok = await verifyTurnstile(env, body.turnstileToken, ip);
  if (!ok) return err(403, "bot_check_failed");

  const ipk = await ipKey(request, env);
  const hourly = await checkAndIncrement(env, ipk, "submit-h", 5, 60 * 60);
  if (!hourly.ok) return err(429, "rate_limit");
  const daily = await checkAndIncrement(env, ipk, "submit-d", 20, 24 * 60 * 60);
  if (!daily.ok) return err(429, "rate_limit");

  const ipHash = await sha256Hex(ipk);
  const ins = await env.DB.prepare(
    "INSERT INTO dreams (text, author, ip_hash) VALUES (?, ?, ?)"
  ).bind(text, author || null, ipHash).run();

  const id = ins.meta && ins.meta.last_row_id ? ins.meta.last_row_id : 0;
  return json({ ok: true, id }, { status: 201 });
}
