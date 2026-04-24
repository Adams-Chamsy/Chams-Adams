/**
 * Requêtes GROQ — source unique pour toutes les lectures Sanity.
 *
 * Convention : constantes en SCREAMING_SNAKE_CASE, une par type de lecture.
 * Toutes retournent des champs en forme directement consommable par l'UI
 * (pas de cleaning côté front).
 */

export const ALL_ARTICLES_QUERY = /* groq */ `
  *[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
    "slug": slug.current,
    title,
    category,
    "date": publishedAt,
    "author": author->name,
    "coverImage": coverImage.asset->url,
    excerpt,
    readingTime
  }
`;

export const ARTICLE_BY_SLUG_QUERY = /* groq */ `
  *[_type == "article" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    category,
    "date": publishedAt,
    "author": author->name,
    "coverImage": coverImage.asset->url,
    excerpt,
    readingTime,
    body
  }
`;

export const ALL_COLLECTIONS_QUERY = /* groq */ `
  *[_type == "collection"] | order(order asc) {
    _id,
    "slug": slug.current,
    name,
    tagline,
    description,
    longDescription,
    "heroImage": {
      "url": heroImage.asset->url,
      "alt": heroImage.alt
    }
  }
`;

export const ALL_PRODUCTS_QUERY = /* groq */ `
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    "slug": slug.current,
    name,
    subtitle,
    description,
    price,
    "category": category->slug.current,
    "categoryName": category->name,
    materials,
    tags,
    isSignature,
    isNew,
    variants
  }
`;

// Events — GROQ renomme pour matcher la shape des mocks (id, date)
export const ALL_EVENTS_QUERY = /* groq */ `
  *[_type == "event"] | order(startDate asc) {
    "id": _id,
    title,
    type,
    "date": startDate,
    "endDate": endDate,
    location,
    city,
    country,
    description,
    cta
  }
`;

export const ALL_PRESS_QUERY = /* groq */ `
  *[_type == "pressEntry"] | order(publishedAt desc) {
    "id": _id,
    publication,
    logoText,
    "date": publishedAt,
    title,
    excerpt,
    articleUrl,
    featured
  }
`;

export const ALL_FAQ_QUERY = /* groq */ `
  *[_type == "faqItem"] | order(category asc, order asc) {
    "id": _id,
    category,
    question,
    answer
  }
`;
