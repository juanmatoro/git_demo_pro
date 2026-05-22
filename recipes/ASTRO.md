# Aprende Astro con el recetario

Este recetario no es solo un sandbox de Git: también es una app real hecha
con **Astro**. Esta guía te enseña cómo está construida, cómo piensa Astro
respecto al renderizado, y cómo usar **islas dinámicas** de forma eficiente
sin tirar el rendimiento por la borda.

> Si vienes del README, esta guía es opcional: solo entrar si te interesa
> aprender Astro. Para practicar Git con las recetas, [PRACTICAS.md](./PRACTICAS.md)
> es tu archivo.

## Índice

- [¿Qué es Astro y por qué existe?](#qué-es-astro-y-por-qué-existe)
- [Cómo funciona Astro: el modelo mental](#cómo-funciona-astro-el-modelo-mental)
- [Renderizado: estático vs dinámico](#renderizado-estático-vs-dinámico)
- [Content Collections (lo que ya usamos)](#content-collections-lo-que-ya-usamos)
- [Las islas dinámicas (Islands Architecture)](#las-islas-dinámicas-islands-architecture)
- [Estrategias de hidratación: las directivas client:*](#estrategias-de-hidratación-las-directivas-client)
- [Tu primera isla, paso a paso (con Preact)](#tu-primera-isla-paso-a-paso-con-preact)
- [Cuándo NO usar una isla](#cuándo-no-usar-una-isla)
- [Patrones eficientes con islas](#patrones-eficientes-con-islas)
- [Ejercicio guiado: buscador de recetas como isla](#ejercicio-guiado-buscador-de-recetas-como-isla)
- [Cómo medir el impacto real](#cómo-medir-el-impacto-real)
- [Errores comunes con islas y cómo salir de ellos](#errores-comunes-con-islas-y-cómo-salir-de-ellos)
- [Preguntas para responder solo](#preguntas-para-responder-solo)
- [Checklist de dominio de Astro](#checklist-de-dominio-de-astro)

---

## ¿Qué es Astro y por qué existe?

Astro es un framework web pensado para sitios **content-driven**: blogs,
documentación, marketing, ecommerce, recetarios. Nació observando un problema
real: la mayoría de sitios en internet **no son apps**, son contenido que el
usuario lee, y sin embargo los frameworks dominantes (Next, Nuxt, Remix)
envían megabytes de JavaScript para hidratar páginas que el visitante solo
va a scrollear.

La propuesta de Astro se resume en tres ideas:

1. **Cero JavaScript por defecto.** Si no hay interactividad, no se envía JS.
   Lo que llega al navegador es HTML puro.
2. **HTML primero, interactividad bajo demanda.** Cuando un bloque sí necesita
   ser interactivo, lo marcas como "isla" y solo ese pedazo se hidrata.
3. **Multi-framework.** Puedes usar React, Preact, Vue, Svelte, Solid o Lit
   dentro del mismo proyecto. Cada componente elige el suyo.

Astro está construido sobre **Vite**, así que heredas HMR rápido, plugins,
import de assets, todo el ecosistema.

### Cuándo usar Astro y cuándo no

| Tipo de proyecto | Astro encaja | Mejor otra cosa |
| --- | --- | --- |
| Blog, docs, marketing, portfolio | Sí | - |
| Recetario, catálogo, landing | Sí | - |
| Ecommerce con carrito | Sí (islas para el carrito) | - |
| Dashboard 100% interactivo, SaaS app | Posible pero forzado | Next, Nuxt, Remix, SvelteKit |
| Editor en tiempo real, juego | No | Next, Nuxt, Solid, React |

Regla de bolsillo: si la mayor parte de tu página es contenido para leer y
solo unos bloques son interactivos, Astro es ideal. Si la página entera es
una app, vas a pelear contra el modelo.

---

## Cómo funciona Astro: el modelo mental

### Anatomía de un archivo `.astro`

Cada componente Astro tiene dos zonas separadas por `---`:

```astro
---
// Frontmatter: TypeScript/JavaScript que corre en BUILD (o en SERVER si SSR).
// NUNCA llega al navegador.
import { getCollection } from 'astro:content';
const recetas = await getCollection('recetas');
const total = recetas.length;
---

<!-- Plantilla: HTML + expresiones {} + componentes -->
<section>
  <h1>Recetas</h1>
  <p>Hay {total} recetas publicadas.</p>
</section>
```

Lectura mental:

- El frontmatter es **código de servidor**. Puede leer archivos, llamar APIs,
  acceder a la base de datos. Se ejecuta una sola vez (en build, o por request
  en SSR).
- La plantilla es **HTML enriquecido**. Lo que sale al navegador es HTML
  resuelto: `<p>Hay 4 recetas publicadas.</p>`.
- **Cero JS se envía al cliente por escribir esto.** Es la diferencia con
  React/Next, donde el componente se serializa para hidratar.

### Por qué importa que el frontmatter no llegue al cliente

Significa que **puedes meter código pesado, secretos, queries** en el
frontmatter sin que el visitante los descargue ni los vea. Es server-side
real. En React/Next necesitas distinguir Server Components vs Client
Components con cuidado; en Astro la separación es física: arriba del `---`
es server, los componentes `client:*` son cliente.

### El sistema de rutas (file-based routing)

Cada archivo en `src/pages/` se convierte en una ruta:

```
src/pages/
├── index.astro              -> /
├── recetas/
│   ├── index.astro          -> /recetas
│   └── [...slug].astro      -> /recetas/limonada, /recetas/tortilla-de-patatas, ...
├── menus.astro              -> /menus
├── practicas.astro          -> /practicas
├── astro.astro              -> /astro (esta guía renderizada)
└── readme.astro             -> /readme
```

Los corchetes `[slug]` o `[...slug]` indican rutas dinámicas que se generan
a partir de datos (en este caso, las recetas).

### Layouts y componentes

```
src/
├── layouts/        # plantillas que envuelven páginas (head, header, footer)
├── components/     # bloques reutilizables (Nav, Card, etc)
└── pages/          # cada archivo es una ruta
```

Un layout es un componente `.astro` que define `<slot />`, y cada página lo
importa para reutilizar la estructura común. Lo verás en `src/layouts/Layout.astro`.

---

## Renderizado: estático vs dinámico

Astro soporta tres modos de renderizado, y conviene entender cada uno antes
de decidir.

### 1. Estático (SSG - Static Site Generation)

- `npm run build` genera **un HTML por cada ruta** en la carpeta `dist/`.
- Subes `dist/` a cualquier CDN (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3).
- Sin servidor corriendo. Sin base de datos en runtime. Sin costos variables.
- Es lo más rápido posible: el HTML ya está, el CDN lo sirve sin computar nada.

**Cuándo**: contenido que cambia rara vez (blog, docs, marketing, este recetario).

### 2. Server (SSR - Server-Side Rendering)

- Cada request genera el HTML en el momento.
- Requiere un **adapter**: `@astrojs/node`, `@astrojs/vercel`, `@astrojs/netlify`, etc.
- Necesitas un servidor Node, una función serverless, o similar.

**Cuándo**: contenido que depende del usuario logueado, datos que cambian
constantemente, formularios server-side, autenticación.

### 3. Híbrido (default en Astro 5)

- Por defecto todo es estático.
- Marcas rutas individuales como dinámicas con `export const prerender = false;`
  en su frontmatter.
- Tienes lo mejor de los dos mundos: la home y el blog son estáticos, el panel
  de admin es SSR.

**Cómo está este recetario:** estático puro. No hay adapter en
`astro.config.mjs`, así que `npm run build` produce HTML estático.

### Cómo cambiar de modo

Para habilitar SSR/híbrido tendrías que:

```bash
npx astro add node     # o vercel, netlify, cloudflare...
```

Eso modifica `astro.config.mjs` y agrega el adapter. Luego en las rutas
estáticas (por ejemplo, el blog) podrías dejarlas como están, y solo en
`src/pages/admin.astro` agregar:

```astro
---
export const prerender = false;
---
```

para que esa ruta concreta se renderice por request.

---

## Content Collections (lo que ya usamos)

Las **content collections** son la forma "oficial" de Astro para organizar
markdown con validación y type-safety. El recetario las usa para las recetas.

### El schema

`src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const recetas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/recetas' }),
  schema: z.object({
    title: z.string(),
    descripcion: z.string(),
    categoria: z.enum(['entrante', 'principal', 'postre', 'bebida', 'desayuno']),
    tiempo: z.string(),
    porciones: z.number(),
    dificultad: z.enum(['muy fácil', 'fácil', 'media', 'difícil']),
    tags: z.array(z.string()).default([]),
    publicado: z.boolean().default(true),
  }),
});

export const collections = { recetas };
```

Lo que ganas:

- **Validación en build**: si una receta no tiene `categoria` o usa un valor
  inválido, `npm run build` falla con un error claro.
- **Autocompletado**: en el editor, `r.data.categoria` te sugiere los valores
  válidos del enum.
- **API consistente**: `getCollection('recetas')` te devuelve un array tipado.

### Cómo consumirla

```astro
---
import { getCollection } from 'astro:content';

const recetas = await getCollection('recetas', ({ data }) => data.publicado);
const porCategoria = Object.groupBy(recetas, (r) => r.data.categoria);
---

{Object.entries(porCategoria).map(([cat, items]) => (
  <section>
    <h2>{cat}</h2>
    <ul>
      {items.map((r) => (
        <li><a href={`/recetas/${r.id.replace(/\.md$/, '')}`}>{r.data.title}</a></li>
      ))}
    </ul>
  </section>
))}
```

### Rutas dinámicas con `getStaticPaths`

Para que cada receta tenga su propia URL (`/recetas/limonada`,
`/recetas/tortilla-de-patatas`), `src/pages/recetas/[...slug].astro` exporta
`getStaticPaths()`:

```astro
---
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const recetas = await getCollection('recetas');
  return recetas.map((receta) => ({
    params: { slug: receta.id.replace(/\.md$/, '') },
    props: { receta },
  }));
}

const { receta } = Astro.props;
const { Content } = await render(receta);
---

<article>
  <h1>{receta.data.title}</h1>
  <Content />
</article>
```

Astro recorre el array que devuelve `getStaticPaths()`, genera un HTML por
cada `params`, y le pasa los `props` a la plantilla. Todo en build time.

---

## Las islas dinámicas (Islands Architecture)

Esta es **la idea estrella de Astro**. Vamos despacio porque cambia cómo
piensas las páginas.

### El problema que resuelve

En un framework tipo Next.js, cuando el usuario abre tu página:

1. El servidor envía HTML.
2. El navegador descarga **todo el JavaScript de la página** (incluido React,
   tus componentes, etc).
3. React reconstruye la página entera en memoria para "hidratarla", es decir,
   conectar el HTML estático con la lógica JS para que sea interactiva.

Esto se llama **hidratación completa**. Pasa siempre, aunque tu página solo
tenga un botón interactivo entre 2000 líneas de texto.

### La solución de Astro

Astro renderiza la página **a HTML puro en el server** (o en build). Luego,
SOLO los componentes que marques explícitamente con una directiva `client:*`
se hidratan en el navegador. Esos son las **islas**.

Diagrama mental:

```
┌───────────────────────────────────────────────┐
│  Mar de HTML estático (rápido, ~0 KB de JS)  │
│                                               │
│   ┌──────────────┐         ┌─────────────┐   │
│   │ Isla:        │         │ Isla:       │   │
│   │ buscador     │         │ toggle tema │   │
│   │ (~5 KB JS)   │         │ (~1 KB JS)  │   │
│   └──────────────┘         └─────────────┘   │
│                                               │
│  Más HTML estático (rápido, ~0 KB de JS)     │
│                                               │
│   ┌──────────────────────┐                    │
│   │ Isla: comentarios    │                    │
│   │ (~12 KB JS)          │                    │
│   └──────────────────────┘                    │
└───────────────────────────────────────────────┘
```

Características clave:

- Cada isla descarga **solo el JS de ese componente** (más su framework).
- Las islas se hidratan **de forma independiente** y en paralelo.
- El HTML que las rodea **nunca descarga JS**.
- Astro renderiza el contenido inicial de la isla en el server: el HTML que
  ves antes de la hidratación es real, no un placeholder. SEO y FCP intactos.

### En qué se diferencia de React Server Components

Ambos buscan reducir JS en el cliente, pero el modelo es distinto:

| | Astro Islands | React Server Components |
| --- | --- | --- |
| Default | Cero JS, todo HTML | Server + Client conviven en mismo tree |
| Hidratación | Por isla, opt-in | Por client component, opt-in vía `'use client'` |
| Framework | Cualquiera (React, Preact, Vue, Svelte...) | Solo React |
| Modelo mental | Página estática con burbujas interactivas | Tree mixto con límites server/client |

Astro es más simple porque la separación es a nivel **archivo y directiva**,
no a nivel function boundary dentro del mismo tree.

---

## Estrategias de hidratación: las directivas `client:*`

Cuando uses una isla, tienes que decirle a Astro **cuándo** cargar su JS.
Estas son las directivas disponibles:

| Directiva | Cuándo se hidrata | Cuándo usar |
| --- | --- | --- |
| `client:load` | Inmediatamente al cargar el HTML | Crítico para uso inmediato: nav principal, carrito visible above-the-fold |
| `client:idle` | Cuando el navegador queda libre (`requestIdleCallback`) | Lo que no es urgente: contadores, widgets de analytics, toggles secundarios |
| `client:visible` | Cuando el componente entra al viewport (`IntersectionObserver`) | Cualquier cosa below-the-fold: comentarios, sliders al final, sidebar |
| `client:visible={{rootMargin: '200px'}}` | Visible + margen anticipado | Cuando quieres precargar un poco antes de que sea visible |
| `client:media={query}` | Cuando una media query coincide | Componentes que solo aplican en ciertos breakpoints: menú mobile, pip en desktop |
| `client:only={framework}` | Solo en cliente, sin SSR | Cuando el componente usa `window`/`localStorage` desde el primer render |

### Regla de oro

> Empieza con `client:visible`. Sube a `client:idle` o `client:load` solo
> cuando midas que importa para la UX.

Razones:

- `client:visible` evita descargar JS de cosas que el usuario nunca llega a
  ver. En una página larga es una mejora gigante.
- `client:idle` es buen default para cosas above-the-fold pero no urgentes
  (un toggle de tema, un widget de "compartir").
- `client:load` solo si la interacción debe estar disponible **antes de**
  que el usuario alcance el componente con el dedo.

### Cuidados con `client:only`

`client:only={'preact'}` (o `'react'`, `'vue'`...) le dice a Astro: **no
renderices este componente en el server**. Solo se renderiza en el cliente,
después de cargar el JS.

Costos:

- **No hay SEO** de ese bloque. Los bots no verán el contenido.
- **Layout shift**: el espacio que ocupa se reserva (o no) sin contenido
  hasta que carga.
- **Spinner / loading state** obligatorio para que no se vea vacío.

Usar **solo si** el componente realmente no puede renderizarse en server
(porque depende de `window`, `document`, `localStorage`, o de APIs de
navegador desde el primer render). En la mayoría de casos lo correcto es
hacer que el componente sea SSR-safe y usar `client:visible` o `client:idle`.

---

## Tu primera isla, paso a paso (con Preact)

Vamos a agregar un buscador real al recetario. Usaremos **Preact** porque es
el framework de UI más chico (~3 KB), pero la receta vale igual para React,
Vue, Svelte o Solid (cambia solo el nombre del paquete).

### 1. Instalar la integración

```bash
cd recipes
npx astro add preact
```

Cuando pregunte, responde `y` a todo. Esto:

- Instala `@astrojs/preact` y `preact` como dependencias.
- Modifica `astro.config.mjs` agregando `integrations: [preact()]`.
- Agrega los tipos a `tsconfig.json`.

### 2. Crear el componente isla

`src/components/BuscadorRecetas.jsx`:

```jsx
import { useState } from 'preact/hooks';

export default function BuscadorRecetas({ recetas }) {
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtradas = q
    ? recetas.filter((r) =>
        r.title.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      )
    : recetas;

  return (
    <div class="buscador">
      <input
        type="search"
        placeholder="Buscar por nombre o tag..."
        value={query}
        onInput={(e) => setQuery(e.currentTarget.value)}
      />
      <p class="contador">{filtradas.length} recetas</p>
      <ul>
        {filtradas.map((r) => (
          <li key={r.slug}>
            <a href={`/recetas/${r.slug}`}>{r.title}</a>
            <span class="cat"> · {r.categoria}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Cosas a notar:

- Importamos hooks de `preact/hooks`, no de React.
- Atributo `class`, no `className` (Preact es más cercano al DOM).
- `onInput` en vez de `onChange` para reactividad inmediata.

### 3. Usarlo desde una página `.astro`

Edita `src/pages/recetas/index.astro` y agrega el buscador. La idea: en el
server preparamos los datos mínimos (no enviamos los markdown completos al
cliente), y se los pasamos como prop al componente isla.

```astro
---
import Layout from '../../layouts/Layout.astro';
import { getCollection } from 'astro:content';
import BuscadorRecetas from '../../components/BuscadorRecetas.jsx';

const todas = await getCollection('recetas', ({ data }) => data.publicado);

// Solo pasamos lo que el buscador necesita. No enviamos descripciones,
// ingredientes ni contenido completo: eso sería sobrecarga inútil.
const recetas = todas.map((r) => ({
  slug: r.id.replace(/\.md$/, ''),
  title: r.data.title,
  categoria: r.data.categoria,
  tags: r.data.tags,
}));
---

<Layout title="Recetas">
  <h1>Recetas</h1>
  <BuscadorRecetas recetas={recetas} client:visible />
</Layout>
```

Punto clave: **`client:visible`**. El JS del buscador (Preact + el componente)
solo se descarga cuando el componente entra al viewport. Si el usuario nunca
hace scroll hasta él, no se descarga.

### 4. Verificar que funciona

```bash
npm run dev
```

Abre http://localhost:4321/recetas, abre DevTools -> Network -> filtro JS, y
recarga. Verás que **al principio no hay JS del buscador**. Cuando el
buscador aparece en pantalla, recién ahí se descarga el chunk.

---

## Cuándo NO usar una isla

A veces lo único que necesitas es un toque de interactividad. Crear una isla
de Preact/React/Vue para eso es un overkill: estarías enviando ~5 KB de
framework para algo que se hace con 200 bytes de JS plano.

### Caso 1: toggle de clase, animación simple, listener de botón

Usa un `<script>` dentro del `.astro`:

```astro
<button id="toggle-tema">Cambiar tema</button>

<script>
  document.getElementById('toggle-tema')?.addEventListener('click', () => {
    document.documentElement.classList.toggle('oscuro');
  });
</script>
```

Esto NO es una isla. Astro empaqueta el script con Vite, lo minifica, y se
sirve junto al HTML. No hay framework involucrado. Mucho más barato.

### Caso 2: contenido que el usuario solo lee

Si renderiza una vez y nunca cambia, es un `.astro` normal. No necesita
ningún client:*.

### Caso 3: enlace o botón de submit a un form

Los formularios HTML nativos funcionan sin JS. Astro tiene **server actions**
o puedes apuntar el form a una ruta SSR. No metas React solo para un form.

### Resumen

| Lo que necesitas | Solución |
| --- | --- |
| Mostrar datos del server | `.astro` solo, en frontmatter |
| Toggle, listener, animación CSS-driven | `<script>` clásico en el .astro |
| Estado local, formulario complejo, lista filtrable | Isla con `client:visible` |
| Componente con `window`/`localStorage` desde render | Isla con `client:only` (último recurso) |

---

## Patrones eficientes con islas

### 1. Islas pequeñas y enfocadas

Una isla = una responsabilidad. No metas medio sitio en un componente
gigante con `client:load`. Si tu página tiene buscador + carrusel +
comentarios, son **3 islas independientes**, no una.

Beneficios: cada una hidrata en paralelo, en su momento óptimo, y un bug en
una no rompe las demás.

### 2. Pasa solo los props que necesita

Los props de una isla **se serializan a JSON** y se incrustan en el HTML
para hidratar. Si pasas un objeto enorme, ese JSON viaja al cliente sin
importar la directiva.

**Mal**:

```astro
<BuscadorRecetas recetas={await getCollection('recetas')} client:visible />
```

Esto envía TODO el contenido de cada receta (markdown completo, frontmatter,
metadata interna) al HTML.

**Bien**:

```astro
---
const recetas = (await getCollection('recetas')).map((r) => ({
  slug: r.id.replace(/\.md$/, ''),
  title: r.data.title,
}));
---
<BuscadorRecetas recetas={recetas} client:visible />
```

Solo `slug` y `title`. El payload se reduce 10x.

### 3. `client:visible` por default

Solo sube a `client:idle` o `client:load` cuando midas que el usuario
necesita la interactividad antes de scrollear.

### 4. Composición con `<slot />` cuando los hijos son estáticos

Si tu isla envuelve contenido que NO necesita ser interactivo (ej: un
acordeón que solo abre y cierra texto), no pases los hijos como prop:
pásalos como slot. El HTML estático no se serializa, solo el componente.

```astro
<Acordeon client:visible>
  <h3 slot="titulo">Ingredientes</h3>
  <ul slot="contenido">
    <li>4 huevos</li>
    <li>500 g de patatas</li>
  </ul>
</Acordeon>
```

### 5. Una isla por bloque, no por página

Tener `<App client:load>` envolviendo todo es **anti-Astro**: equivale a un
SPA normal. Si tienes que hacer eso, quizás Astro no era la herramienta.

### 6. Cuidado al compartir estado entre islas

Cada isla es **un universo aislado**. Dos islas no comparten estado por
default. Si necesitan comunicarse, opciones:

- **Eventos del DOM**: `dispatchEvent(new CustomEvent('carrito:add', {...}))`.
- **Nano Stores** (oficial de Astro): pequeño store cross-island.
- **URL / localStorage** como fuente de verdad compartida.

Evita levantar el estado a un componente padre con `client:load` solo para
compartir: rompe el modelo y vuelve a hidratar todo.

### 7. Lazy-loading de módulos pesados dentro de la isla

Si tu isla usa un gráfico (chart.js, recharts), una librería de mapa, un
editor (codemirror), cárgalo dinámicamente:

```jsx
import { useEffect, useState } from 'preact/hooks';

export default function Mapa({ coords }) {
  const [Lib, setLib] = useState(null);
  useEffect(() => {
    import('leaflet').then((mod) => setLib(() => mod));
  }, []);
  if (!Lib) return <p>Cargando mapa...</p>;
  // ...
}
```

Así el JS crítico de la isla baja primero y la librería pesada después.

---

## Ejercicio guiado: buscador de recetas como isla

Sigue exactamente los pasos de [Tu primera isla, paso a paso](#tu-primera-isla-paso-a-paso-con-preact)
y luego completa:

### Reto 1: agregar filtro por categoría

Modifica `BuscadorRecetas` para que tenga un `<select>` con las categorías
y combine ambos filtros (texto + categoría).

### Reto 2: persistir el último buscado en localStorage

Cuando el usuario vuelva a la página, el input debe recordar lo que tenía.
Pista: `useEffect` + `localStorage.setItem` / `getItem`.

### Reto 3: medir el JS antes y después de `client:visible`

1. Cambia `client:visible` por `client:load`, recarga la página, anota el
   JS total descargado en DevTools -> Network (filtro JS) tras recargar.
2. Vuelve a `client:visible`, recarga sin hacer scroll, anota el JS total.
3. Haz scroll hasta el buscador, mira cómo aumenta.

Vas a ver con datos por qué `client:visible` importa.

### Reto 4: extraer una segunda isla

Agrega un toggle "Solo mis favoritas" que guarde un set de slugs en
`localStorage`. Hazlo como **isla aparte** (componente propio), no la
metas dentro del buscador. Las dos islas se comunicarán vía `localStorage`
o un nano-store.

---

## Cómo medir el impacto real

### En desarrollo

```bash
npm run dev
```

DevTools -> Network -> filtro JS:

- En una página sin islas debes ver ~0 KB de JS de tu código (solo el HMR
  client de Vite, que no va a producción).
- En una página con islas, solo el JS de las islas activas en ese momento.

### En build

```bash
npm run build
npm run preview
```

`preview` sirve el `dist/` exactamente como en producción (sin HMR ni
overhead de Vite). Ahí mides lo real.

DevTools útiles:

- **Network**: filtro JS, mira el tamaño total descargado en la carga
  inicial vs después de scrollear.
- **Performance**: corre un audit y mira **Total Blocking Time (TBT)** y
  **Largest Contentful Paint (LCP)**. Con islas bien usadas, TBT debería
  ser muy bajo (<200 ms).
- **Coverage** (Cmd/Ctrl+Shift+P -> "Show Coverage"): mira qué porcentaje
  del JS descargado se usa. Por encima de 80% significa que tus islas
  están bien dimensionadas.
- **Lighthouse**: corrida completa con score. Para sitios Astro estáticos
  bien hechos, 95+ en Performance es normal.

### Bundle analysis

```bash
npx astro build --verbose
```

Te muestra el tamaño de cada chunk generado. Si una isla genera un chunk
desproporcionado, revisa que no estés importando libs gigantes (`moment`,
`lodash` completo, `chart.js`).

---

## Errores comunes con islas y cómo salir de ellos

| Síntoma | Causa probable | Cómo arreglar |
| --- | --- | --- |
| El componente renderiza pero no es interactivo | Olvidaste la directiva `client:*` | Agrega `client:visible` |
| Error "window is not defined" en build | Componente que usa `window` corre en SSR | Mueve a `useEffect`, o usa `client:only={'preact'}` |
| El payload HTML es enorme | Estás pasando datos pesados como props | Filtra y mapea en el frontmatter antes de pasar |
| Hidratación lenta | Una sola isla gigante envuelve mucho | Divide en varias islas pequeñas |
| Texto parpadea o reorganiza al cargar | `client:only` sin layout reservado | Define `min-height` o usa `client:visible` |
| Dos islas no se "ven" | No comparten estado por default | Usa eventos, nano-stores, o `localStorage` |
| `class` no se aplica en React (en JSX) | React usa `className`, Preact usa `class` | Usa el nombre correcto según el framework |
| Bundle muy grande para algo simple | Importaste React cuando alcanzaba un `<script>` | Reescribe como `<script>` clásico dentro del .astro |

---

## Preguntas para responder solo

1. ¿Por qué el frontmatter de un componente `.astro` no llega al navegador?
2. ¿Qué diferencia hay entre `client:load` y `client:visible`? ¿Cuándo elegirías
   cada uno?
3. Si una isla recibe `recetas={array de 1000 objetos}` como prop, ¿cuánto JSON
   viaja al HTML?
4. ¿Por qué es preferible un `<script>` clásico antes que una isla de Preact
   para un toggle de tema?
5. ¿Qué pasa si pones `client:only={'preact'}` en un componente que muestra
   contenido importante para SEO?
6. Si dos islas necesitan compartir estado, ¿cuáles son tus opciones?
7. ¿En qué se diferencia el modelo de Astro Islands de los React Server
   Components?
8. ¿Cómo sabrías si una isla está sobredimensionada (descarga JS que no se
   usa)?

---

## Checklist de dominio de Astro

Marca cada uno cuando puedas hacerlo sin ayuda:

- [ ] Explicar la diferencia entre el frontmatter y la plantilla de un `.astro`
- [ ] Crear una página nueva en `src/pages/` y verla en `/<nombre>`
- [ ] Crear una ruta dinámica con `[...slug].astro` y `getStaticPaths`
- [ ] Definir un schema de content collection con zod
- [ ] Convertir un componente estático en una isla con `client:visible`
- [ ] Elegir conscientemente entre `client:load`, `client:idle`, `client:visible`,
      `client:media` y `client:only`
- [ ] Identificar un caso donde usar `<script>` clásico es mejor que una isla
- [ ] Compartir estado entre dos islas vía eventos del DOM o nano-stores
- [ ] Medir el JS descargado de una página antes y después de cambiar una
      directiva client:*
- [ ] Reducir el payload de una isla filtrando props en el frontmatter
- [ ] Justificar (o descartar) habilitar SSR en una ruta concreta

Cuando todo esté marcado, ya sabes usar Astro de forma profesional, no solo
"hacer que funcione".
