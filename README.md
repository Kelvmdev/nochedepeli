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

- Subir imágenes con Cloudinary (hoy se pegan URLs).
- Buscador real (la lupa aún no filtra).
- Comprar dominio nochedepeli.com.
