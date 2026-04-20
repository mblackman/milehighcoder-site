import { json, err, readJson } from "../../_utils/http.js";
import { ensureTagsExist, setDreamTags, getTagsForDreams } from "../../_utils/db.js";

const VALID_STATUS = new Set(["approved", "rejected", "pending"]);
const TAG_RE = /^[a-z0-9][a-z0-9-]{0,30}$/;
const RESERVED_TAGS = new Set(["mine"]);

function normTags(input) {
  if (!Array.isArray(input)) return null;
  const out = [];
  for (const raw of input) {
    if (typeof raw !== "string") continue;
    const t = raw.trim().toLowerCase();
    if (!TAG_RE.test(t)) return null;
    if (RESERVED_TAGS.has(t)) return null;
    if (!out.includes(t)) out.push(t);
  }
  return out;
}

export async function onRequestPatch({ request, env, params }) {
  const id = parseInt(params.id, 10);
  if (!Number.isFinite(id) || id <= 0) return err(400, "bad id");

  const body = await readJson(request);
  if (!body || typeof body !== "object") return err(400, "invalid body");

  const exists = await env.DB.prepare("SELECT id FROM dreams WHERE id = ?").bind(id).first();
  if (!exists) return err(404, "not found");

  if (body.status !== undefined) {
    if (!VALID_STATUS.has(body.status)) return err(400, "bad status");
    await env.DB.prepare(
      "UPDATE dreams SET status = ?, reviewed_at = unixepoch() WHERE id = ?"
    ).bind(body.status, id).run();
  }

  if (body.tags !== undefined) {
    const tags = normTags(body.tags);
    if (tags === null) return err(400, "bad tags");
    if (tags.length) await ensureTagsExist(env, tags);
    await setDreamTags(env, id, tags);
  }

  const dream = await env.DB.prepare(
    "SELECT id, text, author, status, created_at, reviewed_at FROM dreams WHERE id = ?"
  ).bind(id).first();
  const tagMap = await getTagsForDreams(env, [id]);
  return json({ ok: true, dream: { ...dream, tags: tagMap.get(id) || [] } });
}

export async function onRequestDelete({ env, params }) {
  const id = parseInt(params.id, 10);
  if (!Number.isFinite(id) || id <= 0) return err(400, "bad id");
  await env.DB.prepare("DELETE FROM dreams WHERE id = ?").bind(id).run();
  return json({ ok: true });
}
