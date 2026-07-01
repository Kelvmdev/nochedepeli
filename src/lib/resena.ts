// Convierte "The Last of Us — Temporada 1" → "the-last-of-us-temporada-1"
export function slugify(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface DatosResena {
  tipo: string;
  pelicula: string;
  titulo: string;
  poster: string;
  backdrop?: string;
  nota: number;
  categoria: string;
  sinopsis: string;
  fecha: string; // YYYY-MM-DD
  destacada: boolean;
  serie?: string;
  temporada?: number;
  plataformas: { nombre: string; tipo: string; url: string }[];
  cuerpo: string;
}

// Escapa un string para YAML (comillas dobles seguras vía JSON).
const s = (v: string) => JSON.stringify(v);

// Arma el archivo .md completo (frontmatter + cuerpo).
export function construirMarkdown(d: DatosResena): string {
  const lineas: string[] = ["---"];
  lineas.push(`tipo: ${s(d.tipo)}`);
  if (d.serie) lineas.push(`serie: ${s(d.serie)}`);
  if (d.temporada != null && !Number.isNaN(d.temporada)) lineas.push(`temporada: ${d.temporada}`);
  lineas.push(`pelicula: ${s(d.pelicula)}`);
  lineas.push(`titulo: ${s(d.titulo)}`);
  lineas.push(`poster: ${s(d.poster)}`);
  if (d.backdrop) lineas.push(`backdrop: ${s(d.backdrop)}`);
  lineas.push(`nota: ${d.nota}`);
  lineas.push(`categoria: ${s(d.categoria)}`);
  lineas.push(`sinopsis: ${s(d.sinopsis)}`);
  lineas.push(`fecha: ${d.fecha}`);
  lineas.push(`destacada: ${d.destacada}`);
  if (d.plataformas.length > 0) {
    lineas.push("plataformas:");
    for (const p of d.plataformas) {
      lineas.push(`  - nombre: ${s(p.nombre)}`);
      lineas.push(`    tipo: ${s(p.tipo)}`);
      lineas.push(`    url: ${s(p.url)}`);
    }
  }
  lineas.push("---", "", d.cuerpo.trim(), "");
  return lineas.join("\n");
}
