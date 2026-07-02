import { defineMiddleware } from "astro:middleware";
import { sesionValida, NOMBRE_COOKIE } from "./lib/auth";

// Rutas que exigen sesión de admin. /admin (login) queda fuera: se muestra
// el formulario cuando no hay sesión.
const PROTEGIDAS = ["/api/crear", "/api/borrar", "/api/config", "/admin/editar"];

export const onRequest = defineMiddleware(({ request, url, cookies, redirect }, next) => {
  // 1. CSRF: los POST a la API solo se aceptan si vienen del propio sitio.
  //    Si hay cabecera Origin y no coincide con el host, se rechaza.
  if (request.method === "POST" && url.pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).host !== url.host) {
      return new Response("Origen no permitido", { status: 403 });
    }
  }

  // 2. Auth centralizada (red de seguridad): sesión válida en rutas protegidas.
  //    Cada endpoint mantiene además su propia comprobación (defensa en profundidad).
  if (PROTEGIDAS.some((p) => url.pathname.startsWith(p))) {
    if (!sesionValida(cookies.get(NOMBRE_COOKIE)?.value)) {
      return redirect("/admin", 303);
    }
  }

  return next();
});
