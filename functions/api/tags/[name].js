import { json, err, readJson } from "../../_utils/http.js";

export async function onRequestPatch({ request, env, params }) {
  const name = String(params.name || "").toLowerCase();
  const exists = await env.DB.prepare("SELECT name FROM tags WHERE name = ?").bind(name).first();
  if (!exists) return err(404, "not found");

  const body = await readJson(request);
  if (!body || typeof body !== "object") return err(400, "invalid body");

  const sets = [];
  const binds = [];
  if (typeof body.weight === "number" && body.weight >= 0) {
    sets.push("weight = ?");
    binds.push(body.weight);
  }
  if (typeof body.style_class === "string") {
    sets.push("style_class = ?");
    binds.push(body.style_class);
  }
  if (!sets.length) return err(400, "no changes");
  binds.push(name);
  await env.DB.prepare(`UPDATE tags SET ${sets.join(", ")} WHERE name = ?`).bind(...binds).run();

  const tag = await env.DB.prepare(
    "SELECT name, weight, style_class FROM tags WHERE name = ?"
  ).bind(name).first();
  return json({ tag });
}

export async function onRequestDelete({ env, params }) {
  const name = String(params.name || "").toLowerCase();
  await env.DB.prepare("DELETE FROM tags WHERE name = ?").bind(name).run();
  return json({ ok: true });
}
