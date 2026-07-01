import type { APIRoute } from "astro";
import { crearSesion, PASSWORD, NOMBRE_COOKIE, OPCIONES_COOKIE } from "../../lib/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const datos = await request.formData();
  const clave = String(datos.get("password") ?? "");

  // Comparación exacta (un carácter distinto = falla). Sin PASSWORD configurada, nunca entra.
  if (!PASSWORD || clave !== PASSWORD) {
    return redirect("/admin?error=1", 303);
  }

  cookies.set(NOMBRE_COOKIE, crearSesion(), OPCIONES_COOKIE);
  return redirect("/admin", 303);
};
