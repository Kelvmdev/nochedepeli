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

  try {
    await guardarArchivo(
      "src/content/site.json",
      JSON.stringify(config, null, 2) + "\n",
      "CMS: actualizar config del sitio"
    );
  } catch (e) {
    return redirect("/admin?err=" + encodeURIComponent(String(e).slice(0, 120)), 303);
  }

  return redirect("/admin?ok=" + encodeURIComponent("configuración del sitio"), 303);
};
