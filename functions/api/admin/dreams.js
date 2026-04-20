import { json, err } from "../../_utils/http.js";
import { getTagsForDreams } from "../../_utils/db.js";

const VALID = new Set(["pending", "approved", "rejected", "all"]);

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const status = (url.searchParams.get("status") || "pending").toLowerCase();
  if (!VALID.has(status)) return err(400, "bad status");
  let limit = parseInt(url.searchParams.get("limit") || "100", 10);
  if (!Number.isFinite(limit) || limit <= 0) limit = 100;
  if (limit > 500) limit = 500;
  // DESC order: cursor is an upper bound (fetch ids strictly less than cursor).
  // First page: no cursor — omit the id filter.
  const cursorRaw = url.searchParams.get("cursor");
  const cursor = cursorRaw ? parseInt(cursorRaw, 10) : null;
  const hasCursor = Number.isFinite(cursor) && cursor > 0;

  let stmt;
  if (status === "all") {
    stmt = hasCursor
      ? env.DB.prepare(
          `SELECT id, text, author, status, created_at, reviewed_at
           FROM dreams WHERE id < ? ORDER BY id DESC LIMIT ?`
        ).bind(cursor, limit)
      : env.DB.prepare(
          `SELECT id, text, author, status, created_at, reviewed_at
           FROM dreams ORDER BY id DESC LIMIT ?`
        ).bind(limit);
  } else {
    stmt = hasCursor
      ? env.DB.prepare(
          `SELECT id, text, author, status, created_at, reviewed_at
           FROM dreams WHERE status = ? AND id < ? ORDER BY id DESC LIMIT ?`
        ).bind(status, cursor, limit)
      : env.DB.prepare(
          `SELECT id, text, author, status, created_at, reviewed_at
           FROM dreams WHERE status = ? ORDER BY id DESC LIMIT ?`
        ).bind(status, limit);
  }
  const rs = await stmt.all();
  const rows = rs.results || [];
  const ids = rows.map(r => r.id);
  const tagMap = await getTagsForDreams(env, ids);
  return json({
    dreams: rows.map(r => ({ ...r, tags: tagMap.get(r.id) || [] })),
    // DESC: last row has smallest id; next page asks for id < that.
    nextCursor: rows.length === limit ? rows[rows.length - 1].id : null,
  });
}
