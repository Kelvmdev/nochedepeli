import type { APIRoute } from "astro";
import { NOMBRE_COOKIE } from "../../lib/auth";

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(NOMBRE_COOKIE, { path: "/" });
  return redirect("/admin", 303);
};
