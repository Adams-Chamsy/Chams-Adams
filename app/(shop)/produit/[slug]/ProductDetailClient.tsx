'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlist.store';
import { centsFromAmount } from '@/lib/utils/price';
import { getPrimaryImage } from '@/lib/types/product';
import { cn } from '@/lib/utils';
import { ProductGallery } from '@/components/product/ProductGallery';
import { VariantSelector } from '@/components/product/VariantSelector';
import { AddToBagButton } from '@/components/product/AddToBagButton';
import { SizeGuide } from '@/components/product/SizeGuide';
import { ProductCard } from '@/components/product/ProductCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ZoomReveal } from '@/components/animations/ZoomReveal';
import { TextReveal } from '@/components/animations/TextReveal';
import { Price } from '@/components/ui/Price';
import { CarePictos } from '@/components/product/CarePictos';
import { ARTryOn } from '@/components/product/ARTryOn';
import { ProductStory } from '@/components/product/ProductStory';
import { AddToCarnet } from '@/components/product/AddToCarnet';
import {
  MATERIAL_LABELS,
  type Product,
  type ProductCategory,
  type ProductSize,
} from '@/lib/types/product';

const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

type Props = {
  product: Product;
  collectionName?: string;
  collectionSlug: ProductCategory;
  related: Product[];
  formattedPrice: string;
  recommendedSize?: string | null;
};

export function ProductDetailClient({
  product,
  collectionName,
  collectionSlug,
  related,
  formattedPrice,
  recommendedSize,
}: Props) {
  const [variant, setVariant] = useState(product.variants[0]!);
  const [size, setSize] = useState<ProductSize | null>(
    variant.sizes.length === 1
      ? variant.sizes[0]!
      : (recommendedSize as ProductSize | null) ?? null
  );
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Wishlist : persisted store (identique au cart). Toggle = add/remove.
  const wishlisted = useWishlistStore((s) => s.has(product.id));
  const toggleWish = useWishlistStore((s) => s.toggleItem);
  const openWishDrawer = useWishlistStore((s) => s.openWishlist);

  const onToggleWish = () => {
    const img = getPrimaryImage(product);
    toggleWish({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productSubtitle: product.subtitle,
      price: centsFromAmount(product.price.amount),
      currency: product.price.currency,
      image: { url: img.url, alt: img.alt },
    });
    // Si on vient de l'ajouter, ouvre le drawer pour confirmer
    if (!wishlisted) setTimeout(() => openWishDrawer(), 300);
  };

  return (
    <>
      {/* Partie supérieure — gallery + infos */}
      <section className="bg-noir pt-[120px] pb-[80px] md:pt-[160px]">
        <div className="container-content">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Galerie (sticky desktop) */}
            <div className="lg:sticky lg:top-28 lg:col-span-7 lg:self-start">
              <ProductGallery
                images={variant.images}
                productName={product.name}
              />
            </div>

            {/* Infos */}
            <div className="flex flex-col gap-8 lg:col-span-5">
              {/* Breadcrumb */}
              <Breadcrumbs
                items={[
                  { label: 'Accueil', href: '/' },
                  { label: 'Collections', href: '/collections' },
                  ...(collectionName
                    ? [
                        {
                          label: collectionName,
                          href: `/collections/${collectionSlug}`,
                        },
                      ]
                    : []),
                  { label: product.name },
                ]}
              />

              {/* Badges */}
              {product.isSignature && (
                <span className="font-serif italic text-or">Pièce signature</span>
              )}

              {/* Nom + sous-titre + prix */}
              <div className="flex flex-col gap-3">
                <TextReveal
                  as="h1"
                  splitBy="words"
                  stagger={0.05}
                  className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.25rem,4vw,3rem)]"
                >
                  {product.name}
                </TextReveal>
                {product.subtitle && (
                  <p className="font-serif italic text-ivoire/70 text-lg md:text-xl">
                    {product.subtitle}
                  </p>
                )}
                <p className="mt-2 font-sans text-2xl tracking-[0.1em] text-ivoire">
                  <Price
                    cents={centsFromAmount(product.price.amount)}
                    baseCurrency={product.price.currency}
                  />
                </p>
              </div>

              {/* Description courte */}
              <p className="max-w-prose font-serif italic text-ivoire/80 text-lg leading-[1.6]">
                {product.description}
              </p>

              {/* Recommandation de taille (gabarit) */}
              {recommendedSize && (
                <p className="border-l-2 border-or/60 pl-4 font-serif italic text-sm text-ivoire/80">
                  D&apos;après votre gabarit, la taille{' '}
                  <strong className="text-or">{recommendedSize}</strong> vous
                  conviendra.
                </p>
              )}

              {/* Variantes */}
              <VariantSelector
                variants={product.variants}
                selectedVariant={variant}
                onVariantChange={(v) => {
                  setVariant(v);
                  setSize(
                    v.sizes.length === 1
                      ? v.sizes[0]!
                      : (recommendedSize as ProductSize | null) ?? null
                  );
                }}
                selectedSize={size}
                onSizeChange={setSize}
                onOpenSizeGuide={() => setSizeGuideOpen(true)}
              />

              {/* CTAs */}
              <div className="flex flex-col gap-4">
                <AddToBagButton
                  product={product}
                  variant={variant}
                  size={size}
                />
                {product.details.glbUrl && (
                  <ARTryOn
                    productName={product.name}
                    glbUrl={product.details.glbUrl}
                    usdzUrl={product.details.usdzUrl}
                  />
                )}
                <div className="flex items-center gap-4">
                  <Link
                    href="/sur-mesure"
                    data-cursor="hover"
                    className="btn-ghost"
                  >
                    Demander le sur-mesure
                    <span aria-hidden>→</span>
                  </Link>
                  <button
                    type="button"
                    onClick={onToggleWish}
                    aria-pressed={wishlisted}
                    aria-label={
                      wishlisted
                        ? 'Retirer de la wishlist'
                        : 'Garder près de soi'
                    }
                    data-cursor="hover"
                    className={cn(
                      'ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300',
                      wishlisted ? 'text-or' : 'text-ivoire hover:text-or'
                    )}
                  >
                    <Heart
                      className="h-5 w-5"
                      aria-hidden
                      fill={wishlisted ? 'currentColor' : 'none'}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>

                <div className="mt-2">
                  <AddToCarnet productSlug={product.slug} />
                </div>
              </div>

              {/* Accordéons détails */}
              <div className="mt-4 flex flex-col divide-y divide-bronze/15 border-y border-bronze/15">
                <DetailAccordion title="Description" defaultOpen>
                  <p className="font-sans text-body-lg leading-[1.75] text-ivoire/75">
                    {product.longDescription ?? product.description}
                  </p>
                </DetailAccordion>

                <DetailAccordion title="Matière & fabrication">
                  <dl className="flex flex-col gap-3 font-sans text-sm text-ivoire/80">
                    <div className="flex justify-between gap-4">
                      <dt className="uppercase tracking-[0.15em] text-ivoire/50">
                        Matières
                      </dt>
                      <dd className="font-serif italic text-right">
                        {product.materials.map((m) => MATERIAL_LABELS[m]).join(', ')}
                      </dd>
                    </div>
                    {product.details.craftingTime && (
                      <div className="flex justify-between gap-4">
                        <dt className="uppercase tracking-[0.15em] text-ivoire/50">
                          Temps de création
                        </dt>
                        <dd className="font-serif italic text-right">
                          {product.details.craftingTime}
                        </dd>
                      </div>
                    )}
                    {product.details.embroidery && (
                      <div className="flex justify-between gap-4">
                        <dt className="uppercase tracking-[0.15em] text-ivoire/50">
                          Broderie
                        </dt>
                        <dd className="font-serif italic text-right">
                          {product.details.embroidery}
                        </dd>
                      </div>
                    )}
                    {product.details.origin && (
                      <div className="flex justify-between gap-4">
                        <dt className="uppercase tracking-[0.15em] text-ivoire/50">
                          Origine
                        </dt>
                        <dd className="font-serif italic text-right">
                          {product.details.origin}
                        </dd>
                      </div>
                    )}
                  </dl>
                </DetailAccordion>

                {(product.details.storyVideoUrl ||
                  product.details.ambientAudioUrl) && (
                  <DetailAccordion title="Récit">
                    <ProductStory
                      productName={product.name}
                      videoUrl={product.details.storyVideoUrl}
                      audioUrl={product.details.ambientAudioUrl}
                    />
                  </DetailAccordion>
                )}

                {((product.details.care && product.details.care.length > 0) ||
                  (product.details.carePictos &&
                    product.details.carePictos.length > 0)) && (
                  <DetailAccordion title="Entretien">
                    <div className="flex flex-col gap-5">
                      {product.details.carePictos &&
                        product.details.carePictos.length > 0 && (
                          <CarePictos codes={product.details.carePictos} />
                        )}
                      {product.details.care &&
                        product.details.care.length > 0 && (
                          <ul className="flex flex-col gap-2 font-sans text-sm text-ivoire/75">
                            {product.details.care.map((c, i) => (
                              <li key={i} className="flex gap-3">
                                <span
                                  aria-hidden
                                  className="mt-2 h-px w-4 shrink-0 bg-or/60"
                                />
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  </DetailAccordion>
                )}

                <DetailAccordion title="Livraison & retours">
                  <div className="flex flex-col gap-3 font-sans text-sm text-ivoire/75">
                    <p>
                      Livraison offerte dès 1 000 € en France métropolitaine et en
                      Afrique de l&apos;Ouest. Expédition sous 3 à 5 jours ouvrés
                      pour les pièces en disponibilité.
                    </p>
                    <p className="font-serif italic text-ivoire/60">
                      Les pièces sur-mesure bénéficient d&apos;un suivi dédié, de
                      l&apos;entretien initial à la remise en atelier.
                    </p>
                  </div>
                </DetailAccordion>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zoom éditorial sur détail */}
      <section className="bg-noir py-[120px] md:py-[160px]">
        <div className="container-content grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            className="flex flex-col gap-6 lg:col-span-4 lg:col-start-2"
          >
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
              Le détail
            </span>
            <h2 className="font-serif font-light text-ivoire text-[clamp(1.75rem,3vw,2.5rem)]">
              Une broderie qui raconte
            </h2>
            <p className="font-serif italic text-ivoire/75 text-lg leading-[1.7]">
              {product.details.embroidery ??
                "Le travail à la main laisse une empreinte que la machine ne saura jamais imiter : une irrégularité noble, une présence."}
            </p>
          </motion.div>

          <ZoomReveal
            scale={[1, 1.25]}
            className="relative aspect-[4/5] w-full overflow-hidden lg:col-span-6"
          >
            <div className="relative h-full w-full">
              <Image
                src={variant.images[1]?.url ?? variant.images[0]?.url ?? ''}
                alt=""
                fill
                sizes="(max-width: 1024px) 95vw, 50vw"
                className="object-cover"
              />
            </div>
          </ZoomReveal>
        </div>
      </section>

      {/* Suggestions */}
      {related.length > 0 && (
        <section className="bg-noir pb-[160px]">
          <div className="container-content flex flex-col gap-12">
            <h2 className="font-serif font-light text-ivoire text-[clamp(1.75rem,3vw,2.5rem)]">
              Vous aimerez également
            </h2>
            <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8">
              {related.slice(0, 3).map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} variant="compact" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );
}

// --------------------------------------------------------------------
// Accordéon détail (CSS-only via <details>)
// --------------------------------------------------------------------

function DetailAccordion({
  title,
  children,
  defaultOpen,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group">
      <summary
        className="flex cursor-pointer list-none items-center justify-between py-5 font-sans text-xs uppercase tracking-[0.25em] text-ivoire transition-colors duration-300 hover:text-or"
        data-cursor="hover"
      >
        {title}
        <span
          aria-hidden
          className="inline-block h-px w-3 bg-ivoire transition-transform duration-300 group-open:rotate-90"
        />
      </summary>
      <div className="pb-6">{children}</div>
    </details>
  );
}
