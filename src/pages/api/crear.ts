import type { APIRoute } from "astro";
import { sesionValida, NOMBRE_COOKIE } from "../../lib/auth";
import { guardarArchivo, githubListo } from "../../lib/github";
import { construirMarkdown, slugify, type DatosResena } from "../../lib/resena";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  // 1. Seguridad: solo con sesión válida
  if (!sesionValida(cookies.get(NOMBRE_COOKIE)?.value)) {
    return redirect("/admin", 303);
  }
  if (!githubListo()) {
    return redirect("/admin?err=" + encodeURIComponent("Falta configurar el token de GitHub."), 303);
  }

  const f = await request.formData();
  const t = (k: string) => String(f.get(k) ?? "").trim();

  // 2. Recolectar plataformas (hasta 3 filas), saltando las vacías
  const plataformas = [];
  for (let i = 1; i <= 3; i++) {
    const nombre = t(`p_nombre_${i}`);
    const url = t(`p_url_${i}`);
    if (nombre && url) plataformas.push({ nombre, tipo: t(`p_tipo_${i}`), url });
  }

  const temporadaRaw = t("temporada");
  const datos: DatosResena = {
    tipo: t("tipo"),
    pelicula: t("pelicula"),
    titulo: t("titulo"),
    poster: t("poster"),
    backdrop: t("backdrop") || undefined,
    nota: Number(t("nota")),
    categoria: t("categoria"),
    sinopsis: t("sinopsis"),
    fecha: t("fecha"),
    destacada: f.get("destacada") === "on",
    serie: t("serie") || undefined,
    temporada: temporadaRaw ? Number(temporadaRaw) : undefined,
    plataformas,
    cuerpo: t("cuerpo"),
  };

  // 3. Validación mínima en el servidor (no confiar solo en el navegador)
  if (!datos.tipo || !datos.pelicula || !datos.titulo || !datos.poster || !datos.sinopsis || !datos.fecha) {
    return redirect("/admin?err=" + encodeURIComponent("Faltan campos obligatorios."), 303);
  }

  // 4. Nombre del archivo (slug).
  // Si viene "slug" (edición), se respeta tal cual. Si no, se genera del nombre.
  const slugManual = t("slug");
  const slug = slugManual
    ? slugManual
    : datos.temporada
      ? `${slugify(datos.pelicula)}-t${datos.temporada}`
      : slugify(datos.pelicula);
  const ruta = `src/content/catalogo/${slug}.md`;

  // 5. Guardar en GitHub
  try {
    await guardarArchivo(ruta, construirMarkdown(datos), `CMS: nueva reseña ${slug}`);
  } catch (e) {
    return redirect("/admin?err=" + encodeURIComponent(String(e).slice(0, 120)), 303);
  }

  return redirect("/admin?ok=" + encodeURIComponent(slug), 303);
};
