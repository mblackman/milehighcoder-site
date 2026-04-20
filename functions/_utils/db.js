export async function getTagsForDreams(env, ids) {
  if (!ids.length) return new Map();
  const placeholders = ids.map(() => "?").join(",");
  const rs = await env.DB.prepare(
    `SELECT dream_id, tag_name FROM dream_tags WHERE dream_id IN (${placeholders})`
  ).bind(...ids).all();
  const map = new Map();
  for (const id of ids) map.set(id, []);
  for (const row of rs.results || []) {
    const arr = map.get(row.dream_id);
    if (arr) arr.push(row.tag_name);
  }
  return map;
}

export async function ensureTagsExist(env, names) {
  if (!names.length) return;
  const stmts = names.map(name =>
    env.DB.prepare(
      "INSERT OR IGNORE INTO tags (name, weight, style_class) VALUES (?, 1.0, ?)"
    ).bind(name, "tag-" + name)
  );
  await env.DB.batch(stmts);
}

export async function setDreamTags(env, dreamId, tagNames) {
  const stmts = [
    env.DB.prepare("DELETE FROM dream_tags WHERE dream_id = ?").bind(dreamId),
  ];
  for (const name of tagNames) {
    stmts.push(
      env.DB.prepare(
        "INSERT INTO dream_tags (dream_id, tag_name) VALUES (?, ?)"
      ).bind(dreamId, name)
    );
  }
  await env.DB.batch(stmts);
}
