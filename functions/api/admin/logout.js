import { clearCookie } from "../../_utils/auth.js";
import { json } from "../../_utils/http.js";

export async function onRequestPost() {
  return json({ ok: true }, { headers: { "set-cookie": clearCookie() } });
}
