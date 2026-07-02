// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Cambiar por el dominio real cuando compres el .com (por ahora, subdominio gratis)
  site: 'https://nochedepeli.vercel.app',

  // Páginas estáticas por defecto; solo /admin y la API serán dinámicas (prerender=false).
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({ filter: (p) => !p.includes('/admin') && !p.includes('/gracias') && !p.includes('/buscar') })
  ]
});