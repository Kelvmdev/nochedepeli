// Optimiza imágenes de Cloudinary: inserta f_auto (WebP/AVIF), q_auto (compresión)
// y w_<ancho> (tamaño justo) tras /upload/. URLs de otros hosts se devuelven igual.
export const img = (url: string | undefined, ancho: number): string =>
  url && url.includes("res.cloudinary.com/") && url.includes("/upload/")
    ? url.replace("/upload/", `/upload/f_auto,q_auto,w_${ancho}/`)
    : (url ?? "");
