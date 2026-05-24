# New Features

Como profesional en desarrollo web senior, implementá la siguiente reestructura del proyecto para que cumpla lo siguiente:

- La estructura de posts del proyecto tiene que ser así:
  - Se debería poder crear grupos, páginas (posts) y subpáginas dentro de páginas
  - Dentro de un grupo se debería poder crear páginas (posts)
  - Dentro de las páginas (posts) se debería poder crear subpáginas (posts)
  - Se deberían poder crear páginas anidadas (subpáginas dentro de páginas) todas las que se quiera sin límite
  - Los grupos, páginas y subpáginas deberían ser expandibles y colapsables, pudiendo navegar entre ellos manteniendo el estado de expandido o colapsado si se navega por distintos posts de cualquiera de ellos, resaltando el que se está visitando
  - El breadcrumb tiene que mostrar la ruta completa, ya sea que pertenezca a un grupo, a una página (post) o subpágina, cada path de la ruta tiene que ser clickeable

  Aspectos a tener en cuenta:
  - Arquitectura y mantenibilidad
  - Escalabilidad
  - Accesibilidad
  - Seguridad
  - Rendimiento
  - Estrategia de testing y calidad de código
  - Developer Experience y CI/CD
  - Monitoreo y Observabilidad en Producción

  - Manteniendo un diseño acorde y coherente, layout, funciones, clases y estilado responsivo, adaptable a diferentes dispositivos y tamaños para mantener una UI agradable y funcional
  - Para la responsividad usar técnicas de estilado modernas, actualizadas y funcionales que no solo dependan de breakpoints, siempre que se pueda usar funciones que permitan la adaptación de textos u otras propiedades css
  - El sidebar se debe convertir en menú tal como hasta ahora, la tabla de contenidos también para que no se pierda y cumpla su funcionalidad aunque en otras vistas como tablet o mobile

- En las cards de los posts destacados en el home, las imágenes tienen que ser más pequeñas, un máximo de 150px y las cards un ancho máximo de 250px. No me gusta que se vean los tags en las cards, saca eso.

- Por cuestiones que no me estaba tomando bien las imágenes el deploy en Vercel

- El archivo `astro.config.mjs` ahora es así

```mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://hackache.vercel.app',
  integrations: [mdx(), sitemap()],
  adapter: vercel(),
});
```
- En `index.astro` y `writeups.astro` añadí

```js
---
import { Image } from "astro:assets";
---
// Reemplacé la etiqueta <img> por <Image>
<Image
  src={post.data.image}
  alt={post.data.title}
  loading="lazy"
/>
```

- Ahora `content.config.ts` es así

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    lang: z.enum(['en', 'es']).default('en'),
    order: z.number().default(99),
    group: z.string().optional(),
    groupOrder: z.number().default(99),
    parent: z.string().optional(),
    featured: z.boolean().default(false),
    image: image().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard', 'insane']).optional(),
    platform: z.string().optional(),
    os: z.enum(['linux', 'windows', 'other']).optional(),
    hints: z.array(z.string()).default([]),
  }),
});

export const collections = { posts };
```

- En `writeup.astro` modifiqué lo siguiente porque no me devolvía nada lo que estaba antes, si ves una manera de hacerlo mejor decime ya que voy a agregar otras plataformas aparte de esas que ya están, no se si hacerlo así sería muy eficaz

```js
const writeups = allPosts
  .filter(
    (p) =>
      p.data.parent === "writeups/hackthebox/machines" ||
      p.data.parent === "writeups/tryhackme/machines",
  )
  .sort((a, b) => a.data.title.localeCompare(b.data.title));
```