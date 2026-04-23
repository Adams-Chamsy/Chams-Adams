/**
 * Helpers pour construire les objets JSON-LD schema.org.
 * Tous les objets ici sont sérialisables — à passer à <JsonLd data={...} />.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://chams-adams.com';

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** schema.org Organization — à injecter une fois au niveau du root layout. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: 'Chams Adams',
    alternateName: 'Maison Chams Adams',
    url: SITE_URL,
    logo: absoluteUrl('/images/logo/chams-adams-monogram.svg'),
    description:
      'Maison de couture — kaftan subsaharien de luxe, héritier du grand boubou ouest-africain.',
    sameAs: [
      'https://www.instagram.com/chams_adams',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'contact@chams-adams.com',
        contactType: 'customer service',
        availableLanguage: ['French', 'English'],
      },
      {
        '@type': 'ContactPoint',
        email: 'presse@chams-adams.com',
        contactType: 'press',
      },
    ],
  };
}

/** schema.org WebSite — active le search box Sitelinks de Google. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    url: SITE_URL,
    name: 'Chams Adams',
    publisher: { '@id': `${SITE_URL}#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/boutique?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** schema.org BreadcrumbList à partir d'une liste d'items label+path. */
export function breadcrumbSchema(
  items: { label: string; href?: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

/** schema.org FAQPage à partir d'une liste question/answer. */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
