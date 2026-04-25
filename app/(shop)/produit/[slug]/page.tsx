import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getProductBySlug,
  getProductsByIds,
  getAllProductSlugs,
} from '@/lib/data/products';
import { getCollectionBySlug } from '@/lib/data/collections';
import { formatPrice } from '@/lib/types/product';
import { ReviewsSection } from '@/components/product/ReviewsSection';
import { WaitlistForm } from '@/components/product/WaitlistForm';
import { CompleteSilhouette } from '@/components/product/CompleteSilhouette';
import { ProductDetailClient } from './ProductDetailClient';

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  const image = product.variants[0]?.images[0];
  return {
    title: `${product.name} · ${product.subtitle ?? 'Pièce Chams Adams'}`,
    description: product.description,
    openGraph: {
      type: 'article',
      title: `${product.name} — Chams Adams`,
      description: product.description,
      images: image ? [image.url] : undefined,
    },
  };
}

export default async function ProductPage(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const collection = await getCollectionBySlug(product.category);
  const related = (await getProductsByIds(product.relatedProductIds ?? []))
    .filter((p) => p.id !== product.id);

  const outOfStock = product.variants.every(
    (v) => v.stock !== undefined && v.stock <= 0
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.variants[0]?.images.map((i) => i.url) ?? [],
    brand: { '@type': 'Brand', name: 'Chams Adams' },
    category: collection?.name,
    offers: {
      '@type': 'Offer',
      price: product.price.amount,
      priceCurrency: product.price.currency,
      availability: outOfStock
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      priceValidUntil: '2027-12-31',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={product}
        collectionName={collection?.name}
        collectionSlug={product.category}
        related={related}
        formattedPrice={formatPrice(product.price)}
      />

      {/* Prévenez-moi : pertinent si hors-stock ou pour une pré-commande */}
      {outOfStock && (
        <section className="bg-noir py-[60px]">
          <div className="container-content max-w-xl">
            <div className="flex flex-col gap-4 border border-or/30 p-6">
              <p className="font-serif italic text-ivoire/80">
                Cette pièce est momentanément épuisée.
              </p>
              <WaitlistForm
                productSlug={product.slug}
                productName={product.name}
                label={`Me prévenir quand ${product.name} revient`}
              />
            </div>
          </div>
        </section>
      )}

      <CompleteSilhouette
        silhouetteSlugs={product.relatedSilhouetteSlugs ?? []}
      />

      <ReviewsSection
        productId={product.id}
        productSlug={product.slug}
        productName={product.name}
      />
    </>
  );
}
