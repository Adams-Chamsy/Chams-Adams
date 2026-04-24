import 'server-only';
import { sanityClient, isSanityEnabled } from '@/lib/sanity/client';
import {
  ALL_ARTICLES_QUERY,
  ARTICLE_BY_SLUG_QUERY,
} from '@/lib/sanity/queries';
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
 *  - `source: 'sanity'` → body est du Portable Text (rendu via <PortableBody>)
 *  - `source: 'mdx'`    → content est du MDX brut (rendu via compileMDX)
 */
export type Article =
  | { source: 'sanity'; meta: JournalArticleMeta; body: unknown[] }
  | { source: 'mdx'; meta: JournalArticleMeta; content: string };

async function fetchSanityArticles(): Promise<JournalArticleMeta[]> {
  if (!isSanityEnabled()) return [];
  try {
    return await sanityClient.fetch<JournalArticleMeta[]>(
      ALL_ARTICLES_QUERY,
      {},
      { next: { revalidate: 120, tags: ['articles'] } }
    );
  } catch (err) {
    console.error('[sanity] articles fallback:', err);
    return [];
  }
}

async function fetchSanityArticle(
  slug: string
): Promise<{ meta: JournalArticleMeta; body: unknown[] } | null> {
  if (!isSanityEnabled()) return null;
  try {
    const data = await sanityClient.fetch<
      (JournalArticleMeta & { body?: unknown[] }) | null
    >(
      ARTICLE_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: 120, tags: [`article:${slug}`] } }
    );
    if (!data) return null;
    const { body, ...meta } = data;
    return { meta: meta as JournalArticleMeta, body: body ?? [] };
  } catch (err) {
    console.error('[sanity] article fetch fallback:', err);
    return null;
  }
}

/** Liste combinée : Sanity prioritaire, MDX comme complément / fallback. */
export async function getAllArticles(): Promise<JournalArticleMeta[]> {
  const [fromSanity, fromMdx] = await Promise.all([
    fetchSanityArticles(),
    getAllMdxArticleMetas().catch(() => [] as JournalArticleMeta[]),
  ]);
  const seen = new Set(fromSanity.map((a) => a.slug));
  const merged = [
    ...fromSanity,
    ...fromMdx.filter((a) => !seen.has(a.slug)),
  ];
  return merged.sort((a, b) => b.date.localeCompare(a.date));
}

/** Récupère un article par slug — Sanity d'abord, MDX en fallback. */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const fromSanity = await fetchSanityArticle(slug);
  if (fromSanity && fromSanity.body.length > 0) {
    return { source: 'sanity', meta: fromSanity.meta, body: fromSanity.body };
  }
  // Sanity vide ou manquant → MDX
  const fromMdx = await getMdxArticleBySlug(slug).catch(() => null);
  if (!fromMdx) return null;
  return { source: 'mdx', meta: fromMdx.meta, content: fromMdx.content };
}

/** Slugs combinés (Sanity + MDX) pour generateStaticParams. */
export async function getAllArticleSlugs(): Promise<string[]> {
  const all = await getAllArticles();
  return all.map((a) => a.slug);
}
