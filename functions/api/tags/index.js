import { json, err, readJson } from "../../_utils/http.js";

const TAG_RE = /^[a-z0-9][a-z0-9-]{0,30}$/;
const RESERVED = new Set(["mine"]); // client-side only markers

export async function onRequestGet({ env }) {
  const rs = await env.DB.prepare(
    "SELECT name, weight, style_class FROM tags ORDER BY name ASC"
  ).all();
  return json({ tags: rs.results || [] });
}

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  if (!body || typeof body !== "object") return err(400, "invalid body");
  const name = typeof body.name === "string" ? body.name.trim().toLowerCase() : "";
  if (!TAG_RE.test(name)) return err(400, "bad name");
  if (RESERVED.has(name)) return err(400, "reserved tag name");
  const weight = typeof body.weight === "number" && body.weight >= 0 ? body.weight : 1.0;
  const styleClass = typeof body.style_class === "string" && body.style_class
    ? body.style_class : `tag-${name}`;
  await env.DB.prepare(
    "INSERT OR IGNORE INTO tags (name, weight, style_class) VALUES (?, ?, ?)"
  ).bind(name, weight, styleClass).run();
  const tag = await env.DB.prepare(
    "SELECT name, weight, style_class FROM tags WHERE name = ?"
  ).bind(name).first();
  return json({ tag }, { status: 201 });
}
