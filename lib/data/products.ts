import 'server-only';
import {
  createSupabaseServerClient,
  isSupabaseEnabled,
} from '@/lib/supabase/server';
import {
  PRODUCTS as PRODUCTS_MOCK,
  getProductBySlug as getMockProductBySlug,
  getAllProductSlugs as getAllMockProductSlugs,
} from './products.mock';
import type {
  Product,
  ProductCategory,
  ProductImage,
  ProductMaterial,
  ProductSize,
} from '@/lib/types/product';

export type { Product } from '@/lib/types/product';

type SupaVariantImage = {
  url: string;
  alt: string | null;
  type: string | null;
  sort_order: number;
  is_primary: boolean;
};

type SupaVariant = {
  id: string;
  color: string | null;
  color_name: string | null;
  sizes: string[];
  stock: number | null;
  sort_order: number;
  images: SupaVariantImage[];
};

type SupaProduct = {
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
  related_silhouette_slugs?: string[];
  story_video_url?: string | null;
  ambient_audio_url?: string | null;
  variants: SupaVariant[];
};

function supaToProduct(raw: SupaProduct): Product | null {
  const variants = (raw.variants ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((v) => ({
      id: v.id,
      color: v.color ?? '#000000',
      colorName: v.color_name ?? '—',
      sizes: (v.sizes ?? []) as ProductSize[],
      stock: v.stock ?? undefined,
      images: (v.images ?? [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(
          (img): ProductImage => ({
            url: img.url,
            alt: img.alt ?? raw.name,
            width: 900,
            height: 1125,
            type: (img.type ?? 'flat') as ProductImage['type'],
            isPrimary: img.is_primary,
          })
        ),
    }))
    .filter((v) => v.images.length > 0);

  if (variants.length === 0) return null;

  const details = (raw.details ?? {}) as {
    craftingTime?: string;
    embroidery?: string;
    origin?: string;
    care?: string[];
    glbUrl?: string;
    usdzUrl?: string;
  };

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    subtitle: raw.subtitle ?? undefined,
    description: raw.description,
    longDescription: raw.long_description ?? undefined,
    price: {
      // price_amount est stocké en cents côté Supabase ; le reste du code
      // (mock, formatPrice) attend des unités entières (ex: 3200 → "3 200 €").
      amount: raw.price_amount / 100,
      currency: raw.price_currency as 'EUR' | 'XOF' | 'USD',
    },
    category: raw.category_slug as ProductCategory,
    materials: (raw.materials ?? []) as ProductMaterial[],
    variants,
    details: {
      craftingTime: details.craftingTime,
      embroidery: details.embroidery,
      origin: details.origin,
      care: details.care ?? [],
      carePictos:
        ((raw as unknown as { care_pictos?: string[] }).care_pictos ?? []) ||
        [],
      glbUrl: details.glbUrl,
      usdzUrl: details.usdzUrl,
      storyVideoUrl: raw.story_video_url ?? undefined,
      ambientAudioUrl: raw.ambient_audio_url ?? undefined,
    },
    tags: raw.tags,
    isNew: raw.is_new,
    isSignature: raw.is_signature,
    relatedProductIds: raw.related_product_slugs,
    relatedSilhouetteSlugs: raw.related_silhouette_slugs ?? [],
  };
}

async function fetchSupabaseProducts(): Promise<Product[]> {
  if (!isSupabaseEnabled()) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from('products')
      .select('*, variants:product_variants(*, images:product_variant_images(*))')
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (!data) return [];
    return (data as SupaProduct[])
      .map(supaToProduct)
      .filter((p): p is Product => p !== null);
  } catch (err) {
    console.error('[supabase] products fallback:', err);
    return [];
  }
}

async function fetchSupabaseProduct(slug: string): Promise<Product | null> {
  if (!isSupabaseEnabled()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from('products')
      .select('*, variants:product_variants(*, images:product_variant_images(*))')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();
    if (!data) return null;
    return supaToProduct(data as SupaProduct);
  } catch {
    return null;
  }
}

/** Merge Supabase + mock par slug (Supabase prioritaire). */
export async function getAllProducts(): Promise<Product[]> {
  const fromSupabase = await fetchSupabaseProducts();
  const seen = new Set(fromSupabase.map((p) => p.slug));
  return [
    ...fromSupabase,
    ...PRODUCTS_MOCK.filter((p) => !seen.has(p.slug)),
  ];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const fromSupabase = await fetchSupabaseProduct(slug);
  if (fromSupabase) return fromSupabase;
  return getMockProductBySlug(slug) ?? null;
}

export async function getAllProductSlugs(): Promise<string[]> {
  const all = await getAllProducts();
  return Array.from(new Set([...all.map((p) => p.slug), ...getAllMockProductSlugs()]));
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const all = await getAllProducts();
  const byId = new Map(all.map((p) => [p.id, p] as const));
  const bySlug = new Map(all.map((p) => [p.slug, p] as const));
  return ids
    .map((ref) => byId.get(ref) ?? bySlug.get(ref))
    .filter((p): p is Product => !!p);
}

export { getProductsByIds as getMockProductsByIds } from './products.mock';
