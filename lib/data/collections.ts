import 'server-only';
import {
  createSupabaseServerClient,
  isSupabaseEnabled,
} from '@/lib/supabase/server';
import {
  COLLECTIONS as COLLECTIONS_MOCK,
  getCollectionBySlug as getMockCollectionBySlug,
} from './collections.mock';
import type { Collection, ProductCategory } from '@/lib/types/product';

export type { Collection } from '@/lib/types/product';

type SupaCollection = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  long_description: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  sort_order: number;
};

function supaToCollection(raw: SupaCollection, productIds: string[]): Collection {
  return {
    id: raw.id,
    slug: raw.slug as ProductCategory,
    name: raw.name,
    tagline: raw.tagline ?? '',
    description: raw.description ?? '',
    longDescription: raw.long_description ?? undefined,
    heroImage: {
      url: raw.hero_image_url ?? '/images/collections/ceremonies.svg',
      alt: raw.hero_image_alt ?? raw.name,
      width: 1200,
      height: 1500,
    },
    productIds,
  };
}

async function fetchSupabaseCollections(): Promise<Collection[]> {
  if (!isSupabaseEnabled()) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data: rows } = await supabase
      .from('collections')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!rows || rows.length === 0) return [];

    // Pour chaque collection, les slugs de produits publiés liés par category_slug
    const { data: products } = await supabase
      .from('products')
      .select('slug, category_slug')
      .eq('published', true);
    const bySlug = new Map<string, string[]>();
    (products ?? []).forEach((p) => {
      const arr = bySlug.get(p.category_slug as string) ?? [];
      arr.push(p.slug as string);
      bySlug.set(p.category_slug as string, arr);
    });

    return (rows as SupaCollection[]).map((r) =>
      supaToCollection(r, bySlug.get(r.slug) ?? [])
    );
  } catch (err) {
    console.error('[supabase] collections fallback:', err);
    return [];
  }
}

async function fetchSupabaseCollectionBySlug(
  slug: string
): Promise<Collection | null> {
  if (!isSupabaseEnabled()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from('collections')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (!data) return null;

    const { data: products } = await supabase
      .from('products')
      .select('slug')
      .eq('category_slug', slug)
      .eq('published', true);
    const productIds = (products ?? []).map((p) => p.slug as string);

    return supaToCollection(data as SupaCollection, productIds);
  } catch {
    return null;
  }
}

// ---------- Public API ----------

/** Merge Supabase + mock (Supabase prioritaire par slug). */
export async function getAllCollections(): Promise<Collection[]> {
  const fromSupabase = await fetchSupabaseCollections();
  if (fromSupabase.length > 0) {
    const seen = new Set(fromSupabase.map((c) => c.slug));
    return [
      ...fromSupabase,
      ...COLLECTIONS_MOCK.filter((c) => !seen.has(c.slug)),
    ];
  }
  return COLLECTIONS_MOCK;
}

export async function getCollectionBySlug(
  slug: string
): Promise<Collection | undefined> {
  const fromSupabase = await fetchSupabaseCollectionBySlug(slug);
  if (fromSupabase) return fromSupabase;
  return getMockCollectionBySlug(slug);
}
