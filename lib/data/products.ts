import 'server-only';
import {
  createSupabaseServerClient,
  isSupabaseEnabled,
} from '@/lib/supabase/server';
import { sanityClient, isSanityEnabled } from '@/lib/sanity/client';
import { urlFor } from '@/lib/sanity/image';
import {
  ALL_PRODUCTS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
} from '@/lib/sanity/queries';
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

// ---------- Supabase ----------

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
  };

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    subtitle: raw.subtitle ?? undefined,
    description: raw.description,
    longDescription: raw.long_description ?? undefined,
    price: {
      amount: raw.price_amount,
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
    },
    tags: raw.tags,
    isNew: raw.is_new,
    isSignature: raw.is_signature,
    relatedProductIds: raw.related_product_slugs,
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

// ---------- Sanity ----------

type SanityImageInput = {
  asset?: { _ref?: string; _type?: 'reference' };
  alt?: string;
  type?: ProductImage['type'];
};

type SanityRawProduct = Omit<Product, 'variants'> & {
  variants: {
    id: string;
    color: string;
    colorName: string;
    sizes: ProductSize[];
    stock?: number;
    images: SanityImageInput[];
  }[];
};

function transformSanityProduct(raw: SanityRawProduct): Product | null {
  try {
    const variants = (raw.variants ?? [])
      .map((v, vIdx) => {
        const images: ProductImage[] = (v.images ?? [])
          .filter(
            (img): img is Required<Pick<SanityImageInput, 'asset'>> & SanityImageInput =>
              !!img?.asset
          )
          .map((img, imgIdx) => ({
            url: urlFor({ _type: 'image', asset: img.asset! })
              .width(1400)
              .fit('max')
              .auto('format')
              .url(),
            alt: img.alt ?? `${raw.name} — ${v.colorName ?? 'variante'}`,
            width: 900,
            height: 1125,
            type: (img.type ?? 'flat') as ProductImage['type'],
            isPrimary: imgIdx === 0,
          }));
        return {
          id: v.id || `var-${vIdx}`,
          color: v.color ?? '#000000',
          colorName: v.colorName ?? '—',
          sizes: v.sizes ?? [],
          stock: v.stock,
          images,
        };
      })
      .filter((v) => v.images.length > 0);

    if (variants.length === 0) return null;

    return {
      ...raw,
      category: (raw.category ?? 'pret-a-porter') as ProductCategory,
      materials: raw.materials ?? [],
      details: raw.details ?? { care: [] },
      variants,
    } as Product;
  } catch {
    return null;
  }
}

async function fetchSanityProducts(): Promise<Product[]> {
  if (!isSanityEnabled()) return [];
  try {
    const raw = await sanityClient.fetch<SanityRawProduct[]>(
      ALL_PRODUCTS_QUERY,
      {},
      { next: { revalidate: 60, tags: ['products'] } }
    );
    return raw.map(transformSanityProduct).filter((p): p is Product => p !== null);
  } catch {
    return [];
  }
}

async function fetchSanityProduct(slug: string): Promise<Product | null> {
  if (!isSanityEnabled()) return null;
  try {
    const raw = await sanityClient.fetch<SanityRawProduct | null>(
      PRODUCT_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: 60, tags: [`product:${slug}`] } }
    );
    return raw ? transformSanityProduct(raw) : null;
  } catch {
    return null;
  }
}

// ---------- Public API ----------

/** Merge Supabase + Sanity + mock par slug (Supabase > Sanity > mock). */
export async function getAllProducts(): Promise<Product[]> {
  const [fromSupabase, fromSanity] = await Promise.all([
    fetchSupabaseProducts(),
    fetchSanityProducts(),
  ]);
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const list of [fromSupabase, fromSanity, PRODUCTS_MOCK]) {
    for (const p of list) {
      if (!seen.has(p.slug)) {
        seen.add(p.slug);
        out.push(p);
      }
    }
  }
  return out;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const fromSupabase = await fetchSupabaseProduct(slug);
  if (fromSupabase) return fromSupabase;
  const fromSanity = await fetchSanityProduct(slug);
  if (fromSanity) return fromSanity;
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
