import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import type { JournalArticleMeta } from './journal-shared';

export type { JournalCategory, JournalArticleMeta } from './journal-shared';
export { formatArticleDate } from './journal-shared';

/**
 * Chargement des articles MDX depuis `content/journal/`.
 * Ce module est SERVER-ONLY (fs, path) — ne jamais l'importer depuis un
 * composant 'use client'. Pour les helpers client-safe (type, format date)
 * importer depuis `@/lib/journal-shared`.
 */

const JOURNAL_DIR = path.join(process.cwd(), 'content/journal');

export async function getAllArticleMetas(): Promise<JournalArticleMeta[]> {
  const files = await fs.readdir(JOURNAL_DIR).catch(() => []);
  const mdxFiles = files.filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  const metas = await Promise.all(
    mdxFiles.map(async (filename) => {
      const full = path.join(JOURNAL_DIR, filename);
      const raw = await fs.readFile(full, 'utf-8');
      const { data } = matter(raw);
      return {
        slug: (data.slug ?? filename.replace(/\.mdx?$/, '')) as string,
        title: data.title as string,
        category: data.category as string,
        date: data.date as string,
        author: data.author as string,
        coverImage: data.coverImage as string,
        excerpt: data.excerpt as string,
        readingTime: (data.readingTime as number) ?? 5,
      };
    })
  );

  // Trié par date décroissante (plus récent en premier)
  return metas.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getArticleBySlug(slug: string): Promise<
  | {
      meta: JournalArticleMeta;
      content: string;
    }
  | null
> {
  const files = await fs.readdir(JOURNAL_DIR).catch(() => []);
  for (const filename of files) {
    if (!filename.endsWith('.mdx') && !filename.endsWith('.md')) continue;
    const full = path.join(JOURNAL_DIR, filename);
    const raw = await fs.readFile(full, 'utf-8');
    const { data, content } = matter(raw);
    const fileSlug = data.slug ?? filename.replace(/\.mdx?$/, '');
    if (fileSlug === slug) {
      return {
        meta: {
          slug: fileSlug as string,
          title: data.title as string,
          category: data.category as string,
          date: data.date as string,
          author: data.author as string,
          coverImage: data.coverImage as string,
          excerpt: data.excerpt as string,
          readingTime: (data.readingTime as number) ?? 5,
        },
        content,
      };
    }
  }
  return null;
}

export async function getAllSlugs(): Promise<string[]> {
  const metas = await getAllArticleMetas();
  return metas.map((m) => m.slug);
}

export function getAllCategories(metas: JournalArticleMeta[]): string[] {
  const set = new Set(metas.map((m) => m.category));
  return Array.from(set);
}
