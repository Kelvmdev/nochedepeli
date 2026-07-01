import datos from "../content/site.json";

// Valores por defecto: si el JSON pierde una clave, no queda undefined (merge a defaults).
const defaults = {
  tagline: "Tu guía para ver cine legal en Colombia.",
  email: "hola@nochedepeli.com",
  instagram: "",
  tiktok: "",
  youtube: "",
};

export const site = { ...defaults, ...datos };
export type Site = typeof site;
