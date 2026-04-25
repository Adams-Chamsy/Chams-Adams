/**
 * Types & helpers du domaine produit.
 *
 * Structure pensée pour un futur branchement Sanity/Shopify :
 *  - `id` et `slug` stables (clés idempotentes du CMS)
 *  - Images riches (alt, dimensions, type) → compatibles Next/Image et Sanity
 *  - Prix en objet avec currency (pas de string formatée en base)
 *  - Variantes imbriquées (couleur + tailles + images propres)
 */

export type ProductCategory =
  | 'ceremonies'
  | 'tabaski-magal'
  | 'pret-a-porter'
  | 'sur-mesure';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'sur-mesure';

export type ProductMaterial =
  | 'bazin-riche'
  | 'soie'
  | 'mousseline'
  | 'satin-brode'
  | 'dentelle';

export interface ProductImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  isPrimary?: boolean;
  type?: 'flat' | 'worn' | 'detail' | 'video';
}

export interface ProductVariant {
  id: string;
  /** Hex couleur principale — ex: "#1B2951" */
  color: string;
  /** Nom lisible — ex: "Indigo profond" */
  colorName: string;
  sizes: ProductSize[];
  images: ProductImage[];
  /** Disponibilité. `undefined` = illimité (sur-mesure). */
  stock?: number;
}

export interface ProductPrice {
  amount: number;
  currency: 'EUR' | 'XOF' | 'USD';
}

export interface ProductDetails {
  craftingTime?: string;
  embroidery?: string;
  origin?: string;
  care?: string[];
  /** Codes de pictogrammes d'entretien (voir CarePictos.tsx) */
  carePictos?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Ex: "Kaftan de cérémonie" */
  subtitle?: string;
  description: string;
  longDescription?: string;
  category: ProductCategory;
  materials: ProductMaterial[];
  variants: ProductVariant[];
  price: ProductPrice;
  details: ProductDetails;
  tags?: string[];
  isNew?: boolean;
  isSignature?: boolean;
  relatedProductIds?: string[];
}

export interface Collection {
  id: string;
  slug: ProductCategory;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  heroImage: ProductImage;
  productIds: string[];
}

// --------------------------------------------------------------------
// Labels lisibles (source unique — évite le polluer les composants)
// --------------------------------------------------------------------

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  ceremonies: 'Cérémonies',
  'tabaski-magal': 'Tabaski & Magal',
  'pret-a-porter': 'Prêt-à-porter',
  'sur-mesure': 'Sur-mesure',
};

export const MATERIAL_LABELS: Record<ProductMaterial, string> = {
  'bazin-riche': 'Bazin riche',
  soie: 'Soie',
  mousseline: 'Mousseline',
  'satin-brode': 'Satin brodé',
  dentelle: 'Dentelle',
};

export const SIZE_LABELS: Record<ProductSize, string> = {
  XS: 'XS',
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: 'XXL',
  'sur-mesure': 'Sur-mesure',
};

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

export function formatPrice(price: ProductPrice): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount);
}

export function getPrimaryImage(product: Product): ProductImage {
  const firstVariant = product.variants[0];
  if (!firstVariant) {
    throw new Error(`Product ${product.id} has no variants`);
  }
  return firstVariant.images.find((i) => i.isPrimary) ?? firstVariant.images[0]!;
}

export function getSecondaryImage(product: Product): ProductImage | null {
  const firstVariant = product.variants[0];
  if (!firstVariant || firstVariant.images.length < 2) return null;
  return firstVariant.images.find((i) => !i.isPrimary) ?? firstVariant.images[1]!;
}
