import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAllCollections, getCollectionBySlug } from '@/lib/data/collections';
import { getProductsByIds } from '@/lib/data/products';
import { TextReveal } from '@/components/animations/TextReveal';
import { ProductCard } from '@/components/product/ProductCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { BackLink } from '@/components/layout/BackLink';

export async function generateStaticParams() {
  const cols = await getAllCollections();
  return cols.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const col = await getCollectionBySlug(params.slug);
  if (!col) return {};
  return {
    title: col.name,
    description: col.description,
    openGraph: {
      title: `${col.name} — Chams Adams`,
      description: col.description,
      images: [col.heroImage.url],
    },
  };
}

export default async function CollectionDetailPage(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const collection = await getCollectionBySlug(params.slug);
  if (!collection) notFound();

  const products = await getProductsByIds(collection.productIds);

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="collection-title"
        className="relative flex h-[80vh] min-h-[600px] items-end overflow-hidden bg-noir"
      >
        <Image
          src={collection.heroImage.url}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-noir/40 via-noir/50 to-noir"
        />
        <div className="container-content relative z-10 flex flex-col gap-6 pb-24">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Collections', href: '/collections' },
              { label: collection.name },
            ]}
          />
          <BackLink href="/collections" label="Collections" />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Collection
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            className="font-serif font-light text-balance leading-[1.02] text-ivoire text-[clamp(3rem,7vw,6rem)]"
          >
            {collection.name}
          </TextReveal>
          <p
            id="collection-title"
            className="max-w-prose font-serif italic text-ivoire/80 text-xl md:text-2xl"
          >
            {collection.tagline}.
          </p>
        </div>
      </section>

      {/* Intro éditoriale */}
      <section className="bg-noir py-[120px] md:py-[160px]">
        <div className="container-content grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
              L&apos;esprit
            </span>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-7">
            <p className="font-serif italic text-ivoire/85 text-2xl md:text-3xl leading-[1.5]">
              {collection.description}
            </p>
            {collection.longDescription && (
              <p className="font-sans text-body-lg leading-[1.75] text-ivoire/75">
                {collection.longDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Grille produits */}
      <section
        aria-labelledby="collection-products-title"
        className="bg-noir pb-[160px]"
      >
        <div className="container-content">
          <div className="mb-12 flex items-baseline justify-between gap-6">
            <h2
              id="collection-products-title"
              className="font-serif font-light text-ivoire text-2xl md:text-3xl"
            >
              La sélection
            </h2>
            <Link
              href="/boutique"
              data-cursor="hover"
              className="font-sans text-xs uppercase tracking-[0.2em] text-or underline-offset-4 hover:underline"
            >
              Voir toute la boutique →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 2} />
            ))}
          </div>
          {products.length === 0 && (
            <p className="font-serif italic text-ivoire/60">
              Les pièces de cette collection sont en préparation.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
