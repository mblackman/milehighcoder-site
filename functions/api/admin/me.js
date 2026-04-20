import { json } from "../../_utils/http.js";

// Reaches here only if _middleware verified admin cookie.
export async function onRequestGet() {
  return json({ ok: true });
}
