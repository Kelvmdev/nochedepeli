import type { CollectionEntry } from "astro:content";

export type Item = CollectionEntry<"catalogo">;

// URL de sección según el tipo: pelicula → /peliculas, serie → /series, anime → /anime
export const seccion = (tipo: Item["data"]["tipo"]) =>
  tipo === "serie" ? "series" : tipo === "anime" ? "anime" : "peliculas";

// Ordena por fecha, más reciente primero
export const porFecha = (a: Item, b: Item) =>
  b.data.fecha.valueOf() - a.data.fecha.valueOf();
