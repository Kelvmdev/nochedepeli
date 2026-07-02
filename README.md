# nochedepeli

Sitio de reseñas de cine (películas / series / anime) + "dónde ver legal" en Colombia.
Astro + Tailwind v4. En vivo: https://nochedepeli.vercel.app

## Publicar contenido (día a día)

Entra al panel **en producción**: https://nochedepeli.vercel.app/admin
Crea / edita / borra reseñas y cambia la config del sitio. Al guardar, se
commitea a GitHub y Vercel republica solo (~1 min). **No edites en local**
para publicar (se desfasa).

## Desarrollo (solo para tocar código)

```sh
npm run dev      # servidor local en :4321
npm run build    # compila (genera og.png en prebuild)
```

Si el CMS guardó algo: `git pull` **antes** de tocar código local (GitHub manda).

## Cómo se guarda el contenido

Cada reseña es un `.md` en `src/content/catalogo/`. Campo `tipo`
(pelicula/serie/anime) = su sección. Series por temporadas: un `.md` por
temporada con `serie` + `temporada` (se enlazan solas). Config del sitio
(tagline, correo, redes) en `src/content/site.json`.

## Variables de entorno

Ver `.env.example`. En local van en `.env.local`; en producción, en Vercel.
Nunca subir secretos a GitHub.

## Pendientes

Tuyo / de negocio:
- **Contenido real:** pósters, links de afiliado reales (varios son `#`) y URLs
  de redes sociales. Se cargan desde `/admin`.
- **Dominio** nochedepeli.com (cambiar `site` en `astro.config.mjs` al comprarlo).
- **AdSense:** los bloques `Anuncio.astro` son placeholders; se activan con cuenta
  aprobada + tráfico.

Opcional / menor:
- Sesión revocable: cambiar `ADMIN_PASSWORD` no cierra sesiones activas (hasta 8h).
  Para invalidarlas ahora hay que rotar `SESSION_SECRET`.
- Unificar los parámetros de error en la URL (`?error=1` del login vs `?err=…` del
  resto) — cosmético.

Antes de "lanzar": con 2–3 reseñas reales cargadas, correr un check final
adversarial (accesibilidad + SEO + PageSpeed en vivo con imágenes reales).

## Ya hecho (auditoría jul 2026)

Seguridad (path traversal en crear, XSS en config, rate-limit + comparación
constante en login, middleware CSRF + auth central, errores de GitHub al log).
Buscador real (`/buscar` + sugerencias en vivo en el Nav). SEO (JSON-LD Review por
ficha). Rendimiento (preload/fetchpriority + srcset del hero). Cloudinary (subida
desde el panel + optimización `f_auto,q_auto,w_`). Listados unificados en
`[seccion]/index.astro`. Correo leído desde el CMS. Fix del carrusel (flechas
dejaban el hero en negro por `data-hero-dir`). Destacar/quitar destacado desde
la lista del panel (`/api/destacar`).
