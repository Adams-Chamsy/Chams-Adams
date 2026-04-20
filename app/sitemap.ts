import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/journal';
import { COLLECTIONS } from '@/lib/data/collections.mock';
import { getAllProductSlugs } from '@/lib/data/products.mock';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://chams-adams.com';

/**
 * Sitemap dynamique Next 14 — inclut toutes les routes statiques +
 * les pages SSG générées depuis les données mock + MDX.
 * Chaque route a sa priorité et sa fréquence de changement indicative.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/collections', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/boutique', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/sur-mesure', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/savoir-faire', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/lookbook', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/journal', priority: 0.7, changeFrequency: 'weekly' as const },
  ];

  const collectionRoutes = COLLECTIONS.map((c) => ({
    path: `/collections/${c.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  }));

  const productRoutes = getAllProductSlugs().map((slug) => ({
    path: `/produit/${slug}`,
    priority: 0.7,
    changeFrequency: 'weekly' as const,
  }));

  const articleSlugs = await getAllSlugs().catch(() => []);
  const journalRoutes = articleSlugs.map((slug) => ({
    path: `/journal/${slug}`,
    priority: 0.6,
    changeFrequency: 'yearly' as const,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes, ...journalRoutes].map(
    (r) => ({
      url: `${SITE_URL}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })
  );
}
