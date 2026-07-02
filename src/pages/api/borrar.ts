import type { APIRoute } from "astro";
import { sesionValida, NOMBRE_COOKIE } from "../../lib/auth";
import { borrarArchivo, githubListo } from "../../lib/github";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!sesionValida(cookies.get(NOMBRE_COOKIE)?.value)) return redirect("/admin", 303);
  if (!githubListo()) {
    return redirect("/admin?err=" + encodeURIComponent("Falta configurar el token de GitHub."), 303);
  }

  const f = await request.formData();
  const slug = String(f.get("slug") ?? "").trim();
  // Seguridad: solo un slug simple, nada de rutas raras (evita salir de la carpeta)
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return redirect("/admin?err=" + encodeURIComponent("Slug inválido."), 303);
  }

  try {
    await borrarArchivo(`src/content/catalogo/${slug}.md`, `CMS: borrar reseña ${slug}`);
  } catch (e) {
    return redirect("/admin?err=" + encodeURIComponent(String(e).slice(0, 120)), 303);
  }

  return redirect("/admin?ok=" + encodeURIComponent(`borrada ${slug}`), 303);
};
