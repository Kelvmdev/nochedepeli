// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Cambiar por el dominio real cuando compres el .com (por ahora, subdominio gratis)
  site: 'https://nochedepeli.vercel.app',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({ filter: (p) => !p.includes('/admin') && !p.includes('/gracias') })
  ]
});