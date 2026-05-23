import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
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
    image: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard', 'insane']).optional(),
    platform: z.string().optional(),
    os: z.enum(['linux', 'windows', 'other']).optional(),
    hints: z.array(z.string()).default([]),
  }),
});

export const collections = { posts };