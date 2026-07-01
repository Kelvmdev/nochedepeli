import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Un solo catálogo: cada archivo es una película o una serie (campo "tipo").
const catalogo = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/catalogo" }),
  schema: z.object({
    tipo: z.enum(["pelicula", "serie", "anime"]),
    pelicula: z.string(),           // nombre de la película/serie
    titulo: z.string(),             // título SEO ("Dónde ver X...")
    poster: z.string(),             // URL del póster (vertical, para cards)
    backdrop: z.string().optional(), // URL horizontal para el hero (opcional)
    nota: z.number().min(0).max(10),
    categoria: z.string(),
    sinopsis: z.string(),
    fecha: z.date(),                // fecha de publicación
    destacada: z.boolean().default(false),
    // Series por temporadas: cada temporada es su propia reseña.
    // "serie" agrupa las temporadas de un mismo show; "temporada" es el número.
    serie: z.string().optional(),
    temporada: z.number().optional(),
    // Dónde verla legal (el negocio: links de afiliado)
    plataformas: z.array(z.object({
      nombre: z.string(),
      tipo: z.string(),             // "Incluida · suscripción", "$9.900", etc.
      url: z.string(),              // link de afiliado
    })).default([]),
  }),
});

export const collections = { catalogo };
