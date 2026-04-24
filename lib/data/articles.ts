import 'server-only';
import {
  createSupabaseServerClient,
  isSupabaseEnabled,
} from '@/lib/supabase/server';
import {
  getAllArticleMetas as getAllMdxArticleMetas,
  getArticleBySlug as getMdxArticleBySlug,
  getAllCategories as getAllCategoriesFromMetas,
} from '@/lib/journal';
import type { JournalArticleMeta } from '@/lib/journal-shared';

export type { JournalArticleMeta } from '@/lib/journal-shared';
export { formatArticleDate } from '@/lib/journal-shared';
export { getAllCategoriesFromMetas as getAllCategories };

/**
 * Résultat unifié pour /journal/[slug] :
 *  - `source: 'supabase'` → body Tiptap JSON (rendu via <TiptapBody>)
 *  - `source: 'mdx'`      → content MDX brut (rendu via compileMDX) pour les
 *                           3 articles historiques `content/journal/*.mdx`
 */
export type Article =
  | { source: 'supabase'; meta: JournalArticleMeta; body: unknown }
  | { source: 'mdx'; meta: JournalArticleMeta; content: string };

async function fetchSupabaseArticles(): Promise<JournalArticleMeta[]> {
  if (!isSupabaseEnabled()) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from('articles')
      .select(
        'slug, title, category, excerpt, cover_image_url, reading_time, published_at, author:author_id(name)'
      )
      .eq('published', true)
      .order('published_at', { ascending: false });
    if (!data) return [];
    return data.map((row) => {
      const authorRaw = (row as { author: unknown }).author;
      const authorName =
        authorRaw && typeof authorRaw === 'object' && 'name' in authorRaw
          ? ((authorRaw as { name?: string }).name ?? 'Chams Adams')
          : 'Chams Adams';
      return {
        slug: row.slug as string,
        title: row.title as string,
        category: (row.category as string) ?? '',
        date: (row.published_at as string) ?? new Date().toISOString(),
        author: authorName,
        coverImage: (row.cover_image_url as string) ?? '',
        excerpt: (row.excerpt as string) ?? '',
        readingTime: (row.reading_time as number) ?? 5,
      };
    });
  } catch (err) {
    console.error('[supabase] articles list fallback:', err);
    return [];
  }
}

async function fetchSupabaseArticle(
  slug: string
): Promise<{ meta: JournalArticleMeta; body: unknown } | null> {
  if (!isSupabaseEnabled()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from('articles')
      .select(
        'slug, title, category, excerpt, cover_image_url, reading_time, published_at, body_json, author:author_id(name)'
      )
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();
    if (!data) return null;
    const authorRaw = (data as { author: unknown }).author;
    const authorName =
      authorRaw && typeof authorRaw === 'object' && 'name' in authorRaw
        ? ((authorRaw as { name?: string }).name ?? 'Chams Adams')
        : 'Chams Adams';
    return {
      meta: {
        slug: data.slug as string,
        title: data.title as string,
        category: (data.category as string) ?? '',
        date: (data.published_at as string) ?? new Date().toISOString(),
        author: authorName,
        coverImage: (data.cover_image_url as string) ?? '',
        excerpt: (data.excerpt as string) ?? '',
        readingTime: (data.reading_time as number) ?? 5,
      },
      body: data.body_json,
    };
  } catch (err) {
    console.error('[supabase] article fetch fallback:', err);
    return null;
  }
}

/** Merge Supabase + MDX legacy. Supabase prioritaire. */
export async function getAllArticles(): Promise<JournalArticleMeta[]> {
  const [fromSupabase, fromMdx] = await Promise.all([
    fetchSupabaseArticles(),
    getAllMdxArticleMetas().catch(() => [] as JournalArticleMeta[]),
  ]);
  const seen = new Set(fromSupabase.map((a) => a.slug));
  const merged = [
    ...fromSupabase,
    ...fromMdx.filter((a) => !seen.has(a.slug)),
  ];
  return merged.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const fromSupabase = await fetchSupabaseArticle(slug);
  if (fromSupabase) {
    return { source: 'supabase', meta: fromSupabase.meta, body: fromSupabase.body };
  }
  const fromMdx = await getMdxArticleBySlug(slug).catch(() => null);
  if (!fromMdx) return null;
  return { source: 'mdx', meta: fromMdx.meta, content: fromMdx.content };
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const all = await getAllArticles();
  return all.map((a) => a.slug);
}
