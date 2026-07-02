import type { APIRoute } from "astro";
import { crearSesion, claveCorrecta, NOMBRE_COOKIE, OPCIONES_COOKIE } from "../../lib/auth";

export const prerender = false;

// Freno a la fuerza bruta: tras 5 fallos, bloquea esa IP 5 minutos.
// ponytail: contador en memoria; se reinicia por instancia/cold start en Vercel.
// Es un tope de velocidad, no un muro. Subir a Vercel KV si hace falta algo global.
const MAX_FALLOS = 5;
const BLOQUEO_MS = 5 * 60 * 1000;
const intentos = new Map<string, { fallos: number; hasta: number }>();

export const POST: APIRoute = async ({ request, clientAddress, cookies, redirect }) => {
  const ip = clientAddress || request.headers.get("x-forwarded-for") || "?";
  const ahora = Date.now();
  const reg = intentos.get(ip) ?? { fallos: 0, hasta: 0 };

  if (reg.hasta > ahora) {
    return redirect("/admin?err=" + encodeURIComponent("Demasiados intentos. Espera unos minutos."), 303);
  }

  const datos = await request.formData();
  const clave = String(datos.get("password") ?? "");

  if (!claveCorrecta(clave)) {
    reg.fallos++;
    if (reg.fallos >= MAX_FALLOS) { reg.hasta = ahora + BLOQUEO_MS; reg.fallos = 0; }
    intentos.set(ip, reg);
    return redirect("/admin?error=1", 303);
  }

  intentos.delete(ip); // login correcto: limpia el contador
  cookies.set(NOMBRE_COOKIE, crearSesion(), OPCIONES_COOKIE);
  return redirect("/admin", 303);
};
