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
  const [notes, writeups] = await Promise.all([
    getCollection('notes', ({ data }) => !data.draft),
    getCollection('writeups', ({ data }) => !data.draft),
  ]);

  const noteItems = notes.map(entry => ({
    title: entry.data.title,
    description: entry.data.description ?? '',
    url: `/notes/${entry.id}`,
    tags: entry.data.tags,
    section: 'notes',
    category: entry.id.split('/')[0],
    content: stripMarkdown((entry as any).body ?? ''),
  }));

  const writeupItems = writeups.map(entry => ({
    title: entry.data.title,
    description: entry.data.description ?? '',
    url: `/writeups/${entry.id}`,
    tags: entry.data.tags,
    section: 'writeups',
    category: entry.id.split('/')[0],
    difficulty: entry.data.difficulty,
    os: entry.data.os,
    content: stripMarkdown((entry as any).body ?? ''),
  }));

  return new Response(JSON.stringify([...noteItems, ...writeupItems]), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};