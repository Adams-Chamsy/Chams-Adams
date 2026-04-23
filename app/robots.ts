import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://chams-adams.com';

/**
 * robots.txt dynamique Next 14.
 *
 * - Autorise l'indexation générale.
 * - Bloque les routes transactionnelles (checkout, panier) et le profil
 *   local (compte) qui ne présentent aucun contenu public indexable.
 * - Renvoie le sitemap à Googlebot & consorts.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/checkout',
          '/panier',
          '/compte',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
