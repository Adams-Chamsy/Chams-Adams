/**
 * Types Supabase — version typée à la main (regénérable via `supabase gen types`
 * une fois la CLI configurée). Couvre les tables éditoriales et transactionnelles.
 */

export type AdminRole = 'admin' | 'editor' | 'viewer';

export interface AdminUserRow {
  id: string;
  role: AdminRole;
  email: string | null;
  created_at: string;
}

export interface FaqItemRow {
  id: string;
  category:
    | 'livraison'
    | 'sur-mesure'
    | 'entretien'
    | 'paiement'
    | 'retours'
    | 'atelier';
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventRow {
  id: string;
  title: string;
  type: 'defile' | 'showroom' | 'ceremonie' | 'presse' | 'collection';
  start_date: string;
  end_date: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
  cta: { label?: string; href?: string } | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PressEntryRow {
  id: string;
  publication: string;
  logo_text: string | null;
  published_at: string;
  title: string;
  excerpt: string | null;
  article_url: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CollectionRow {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  long_description: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  description: string;
  long_description: string | null;
  price_amount: number;
  price_currency: string;
  category_slug: string;
  materials: string[];
  details: Record<string, unknown>;
  tags: string[];
  is_signature: boolean;
  is_new: boolean;
  related_product_slugs: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author_id: string | null;
  body_json: unknown;
  reading_time: number;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthorRow {
  id: string;
  name: string;
  slug: string | null;
  portrait_url: string | null;
  bio: string | null;
  role_title: string | null;
  created_at: string;
  updated_at: string;
}
