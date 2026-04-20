import { isAdmin } from "./_utils/auth.js";
import { err } from "./_utils/http.js";

const ADMIN_PROTECTED = [
  /^\/api\/admin\/(?!login$)[^/]+/, // everything under /api/admin/ except login
  /^\/api\/dreams\/\d+$/,           // PATCH/DELETE on a dream
  /^\/api\/tags$/,                   // POST create
  /^\/api\/tags\/[^/]+$/,            // PATCH/DELETE on a tag
];

const PUBLIC_METHODS = {
  "/api/dreams": ["GET", "POST"],
  "/api/tags": ["GET"], // POST falls through to admin gate below
};

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (!path.startsWith("/api/")) return next();

  // /api/dreams allowed for anyone (GET/POST). Admin gate handled per-endpoint.
  // /api/tags GET allowed for anyone; POST gated below.
  const publicMethods = PUBLIC_METHODS[path];
  if (publicMethods && publicMethods.includes(method)) return next();

  // /api/admin/login is anonymous
  if (path === "/api/admin/login" && method === "POST") return next();

  const needsAdmin = ADMIN_PROTECTED.some(re => re.test(path)) ||
    (path === "/api/tags" && method === "POST");

  if (needsAdmin) {
    const ok = await isAdmin(request, context.env);
    if (!ok) return err(401, "unauthorized");
  }

  return next();
}
