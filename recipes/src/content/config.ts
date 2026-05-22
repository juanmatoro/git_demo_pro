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
