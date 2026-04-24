import 'server-only';
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
  getProductsByIds as getMockProductsByIds,
} from './products.mock';
import type {
  Product,
  ProductCategory,
  ProductImage,
} from '@/lib/types/product';

export type { Product } from '@/lib/types/product';

type SanityImageInput = {
  asset?: { _ref?: string; _type?: 'reference' };
  alt?: string;
  type?: ProductImage['type'];
};

type RawProduct = Omit<Product, 'variants'> & {
  variants: {
    id: string;
    color: string;
    colorName: string;
    sizes: Product['variants'][number]['sizes'];
    stock?: number;
    images: SanityImageInput[];
  }[];
};

function transformProduct(raw: RawProduct): Product | null {
  try {
    const variants = (raw.variants ?? [])
      .map((v, vIdx) => {
        const images: ProductImage[] = (v.images ?? [])
          .filter((img): img is Required<Pick<SanityImageInput, 'asset'>> & SanityImageInput => !!img?.asset)
          .map((img, imgIdx) => ({
            url: urlFor({
              _type: 'image',
              asset: img.asset!,
            })
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
  } catch (err) {
    console.warn('[sanity] product transform failed:', err);
    return null;
  }
}

async function fetchSanityProducts(): Promise<Product[]> {
  if (!isSanityEnabled()) return [];
  try {
    const raw = await sanityClient.fetch<RawProduct[]>(
      ALL_PRODUCTS_QUERY,
      {},
      { next: { revalidate: 60, tags: ['products'] } }
    );
    return raw
      .map(transformProduct)
      .filter((p): p is Product => p !== null);
  } catch (err) {
    console.error('[sanity] products fetch fallback:', err);
    return [];
  }
}

async function fetchSanityProduct(slug: string): Promise<Product | null> {
  if (!isSanityEnabled()) return null;
  try {
    const raw = await sanityClient.fetch<RawProduct | null>(
      PRODUCT_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: 60, tags: [`product:${slug}`] } }
    );
    return raw ? transformProduct(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Liste produits — merge Sanity + mock. En cas de doublon de slug,
 * Sanity est prioritaire (l'édition Studio écrase le mock).
 */
export async function getAllProducts(): Promise<Product[]> {
  const fromSanity = await fetchSanityProducts();
  const sanitySlugs = new Set(fromSanity.map((p) => p.slug));
  const merged = [
    ...fromSanity,
    ...PRODUCTS_MOCK.filter((p) => !sanitySlugs.has(p.slug)),
  ];
  return merged;
}

/** Produit par slug — Sanity prioritaire, fallback mock. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const fromSanity = await fetchSanityProduct(slug);
  if (fromSanity) return fromSanity;
  return getMockProductBySlug(slug) ?? null;
}

/** Slugs combinés pour generateStaticParams. */
export async function getAllProductSlugs(): Promise<string[]> {
  const all = await getAllProducts();
  return Array.from(new Set([...all.map((p) => p.slug), ...getAllMockProductSlugs()]));
}

/** Récupère une liste de produits par ID — fallback mock. */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const all = await getAllProducts();
  const byId = new Map(all.map((p) => [p.id, p] as const));
  const bySlug = new Map(all.map((p) => [p.slug, p] as const));
  // Les `relatedProductIds` du mock utilisent les slugs ; on accepte les deux.
  return ids
    .map((ref) => byId.get(ref) ?? bySlug.get(ref))
    .filter((p): p is Product => !!p);
}

export { getProductsByIds as getMockProductsByIds } from './products.mock';
