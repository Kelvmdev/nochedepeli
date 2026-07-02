import type { APIRoute } from "astro";
import { sesionValida, NOMBRE_COOKIE } from "../../lib/auth";
import { guardarArchivo, githubListo } from "../../lib/github";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!sesionValida(cookies.get(NOMBRE_COOKIE)?.value)) return redirect("/admin", 303);
  if (!githubListo()) {
    return redirect("/admin?err=" + encodeURIComponent("Falta configurar el token de GitHub."), 303);
  }

  const f = await request.formData();
  const t = (k: string) => String(f.get(k) ?? "").trim();

  const config = {
    tagline: t("tagline"),
    email: t("email"),
    instagram: t("instagram"),
    tiktok: t("tiktok"),
    youtube: t("youtube"),
  };

  // Blindaje XSS: estos valores se renderizan como href en el footer.
  // Un "javascript:..." sería XSS. Redes deben ser https://; email, formato válido.
  const esHttps = (v: string) => !v || /^https:\/\/\S+$/.test(v);
  const esEmail = (v: string) => !v || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
  if (!esHttps(config.instagram) || !esHttps(config.tiktok) || !esHttps(config.youtube) || !esEmail(config.email)) {
    return redirect("/admin?err=" + encodeURIComponent("Redes deben empezar por https:// y el correo debe ser válido."), 303);
  }

  try {
    await guardarArchivo(
      "src/content/site.json",
      JSON.stringify(config, null, 2) + "\n",
      "CMS: actualizar config del sitio"
    );
  } catch (e) {
    console.error("Error al guardar config en GitHub:", e); // detalle solo en el server
    return redirect("/admin?err=" + encodeURIComponent("No se pudo guardar. Intenta de nuevo."), 303);
  }

  return redirect("/admin?ok=" + encodeURIComponent("configuración del sitio"), 303);
};
