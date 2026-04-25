import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/journal';
import { COLLECTIONS } from '@/lib/data/collections.mock';
import { getAllProductSlugs } from '@/lib/data/products.mock';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://chams-adams.com';

type RouteDef = {
  path: string;
  priority: number;
  changeFrequency:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
};

/**
 * Sitemap dynamique Next 14 — inclut toutes les routes statiques + les
 * pages SSG générées depuis les données mock + MDX. Chaque route a sa
 * priorité et sa fréquence de changement indicative.
 *
 * Exclus du sitemap (contenu non-indexable) :
 *  - /compte : page profil local (noindex), non indexable
 *  - /checkout, /panier : pages transactionnelles éphémères
 *  - /404, /500 : gérés par Next automatiquement
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: RouteDef[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/maison', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/collections', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/boutique', priority: 0.9, changeFrequency: 'daily' },
    { path: '/sur-mesure', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/savoir-faire', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/lookbook', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/journal', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/presse', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/evenements', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/guide-tailles', priority: 0.6, changeFrequency: 'yearly' },
    { path: '/contact', priority: 0.6, changeFrequency: 'yearly' },
    { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
    // Pages légales — basse priorité, change rarement
    { path: '/mentions-legales', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/cgv', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/confidentialite', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/livraison-retours', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/retours/demande', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/presse/dossier', priority: 0.6, changeFrequency: 'yearly' },
  ];

  const collectionRoutes: RouteDef[] = COLLECTIONS.map((c) => ({
    path: `/collections/${c.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly',
  }));

  const productRoutes: RouteDef[] = getAllProductSlugs().map((slug) => ({
    path: `/produit/${slug}`,
    priority: 0.7,
    changeFrequency: 'weekly',
  }));

  const articleSlugs = await getAllSlugs().catch(() => []);
  const journalRoutes: RouteDef[] = articleSlugs.map((slug) => ({
    path: `/journal/${slug}`,
    priority: 0.6,
    changeFrequency: 'yearly',
  }));

  return [
    ...staticRoutes,
    ...collectionRoutes,
    ...productRoutes,
    ...journalRoutes,
  ].map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
