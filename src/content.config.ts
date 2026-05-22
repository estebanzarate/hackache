import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    order: z.number().optional(),
    lang: z.enum(['en', 'es']).default('en'),
  }),
});

const writeups = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writeups' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    lang: z.enum(['en', 'es']).default('en'),
    difficulty: z.enum(['easy', 'medium', 'hard', 'insane']).optional(),
    platform: z.string().optional(),
    os: z.enum(['linux', 'windows', 'other']).optional(),
  }),
});

export const collections = { notes, writeups };