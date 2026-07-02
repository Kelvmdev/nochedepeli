import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { sesionValida, NOMBRE_COOKIE } from "../../lib/auth";
import { guardarArchivo, githubListo } from "../../lib/github";
import { construirMarkdown, type DatosResena } from "../../lib/resena";

export const prerender = false;

// Invierte el flag "destacada" de una reseña (aparece o no en el hero).
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!sesionValida(cookies.get(NOMBRE_COOKIE)?.value)) return redirect("/admin", 303);
  if (!githubListo()) {
    return redirect("/admin?err=" + encodeURIComponent("Falta configurar el token de GitHub."), 303);
  }

  const f = await request.formData();
  const slug = String(f.get("slug") ?? "").trim();
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return redirect("/admin?err=" + encodeURIComponent("Slug inválido."), 303);
  }

  const entry = (await getCollection("catalogo")).find((e) => e.id === slug);
  if (!entry) return redirect("/admin?err=" + encodeURIComponent("La reseña no existe."), 303);

  const d = entry.data;
  const datos: DatosResena = {
    tipo: d.tipo,
    pelicula: d.pelicula,
    titulo: d.titulo,
    poster: d.poster,
    backdrop: d.backdrop,
    nota: d.nota,
    categoria: d.categoria,
    sinopsis: d.sinopsis,
    fecha: d.fecha.toISOString().slice(0, 10),
    destacada: !d.destacada, // el cambio: invierte
    serie: d.serie,
    temporada: d.temporada,
    plataformas: d.plataformas,
    cuerpo: entry.body ?? "",
  };

  try {
    const accion = datos.destacada ? "destacar" : "quitar destacado";
    await guardarArchivo(`src/content/catalogo/${slug}.md`, construirMarkdown(datos), `CMS: ${accion} ${slug}`);
  } catch (e) {
    console.error("Error al destacar en GitHub:", e);
    return redirect("/admin?err=" + encodeURIComponent("No se pudo cambiar. Intenta de nuevo."), 303);
  }

  return redirect("/admin?ok=" + encodeURIComponent(`${slug} · ${datos.destacada ? "ahora destacada" : "quitada de destacadas"}`), 303);
};
