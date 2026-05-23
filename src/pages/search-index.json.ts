import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const prerender = true;

const stripMarkdown = (md: string) =>
  md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/#{1,6}\s+/g, ' ')
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*+>]\s+/gm, ' ')
    .replace(/\|[^\n]*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);

  const items = posts.map(entry => ({
    title: entry.data.title,
    description: entry.data.description ?? '',
    url: `/${entry.id}`,
    tags: entry.data.tags,
    section: entry.data.group ?? 'general',
    category: entry.data.group ?? '',
    content: stripMarkdown((entry as any).body ?? ''),
  }));

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};