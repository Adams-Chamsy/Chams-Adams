'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useT } from '@/lib/i18n/client';
import {
  getPrimaryImage,
  getSecondaryImage,
  type Product,
} from '@/lib/types/product';
import { Price } from '@/components/ui/Price';

export type ProductCardVariant = 'default' | 'editorial' | 'compact';

export type ProductCardProps = {
  product: Product;
  variant?: ProductCardVariant;
  priority?: boolean;
  className?: string;
};

/**
 * Card produit réutilisable — 3 variantes visuelles :
 *  - `default` : grille boutique, ratio 4:5, hover crossfade primaire↔détail
 *  - `editorial` : plus ample, typo plus grosse (collections featured)
 *  - `compact` : petite carte (suggestions "Vous aimerez également")
 */
export function ProductCard({
  product,
  variant = 'default',
  priority,
  className,
}: ProductCardProps) {
  const t = useT();
  const primary = getPrimaryImage(product);
  const secondary = getSecondaryImage(product);

  const isEditorial = variant === 'editorial';
  const isCompact = variant === 'compact';

  return (
    <Link
      href={`/produit/${product.slug}`}
      data-cursor="hover"
      className={cn(
        'group relative block transition-transform duration-700 ease-out-expo hover:-translate-y-1',
        className
      )}
    >
      {/* Images */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-noir-800">
        <Image
          src={primary.url}
          alt={primary.alt}
          fill
          priority={priority}
          sizes={
            isEditorial
              ? '(max-width: 768px) 95vw, (max-width: 1280px) 60vw, 50vw'
              : isCompact
                ? '(max-width: 768px) 45vw, 22vw'
                : '(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 28vw'
          }
          className="object-cover transition-opacity duration-700 ease-out-expo group-hover:opacity-0"
        />
        {secondary && (
          <Image
            src={secondary.url}
            alt={secondary.alt}
            fill
            sizes={
              isEditorial
                ? '(max-width: 768px) 95vw, 50vw'
                : '(max-width: 768px) 90vw, 28vw'
            }
            className="absolute inset-0 object-cover opacity-0 transition-opacity duration-700 ease-out-expo group-hover:opacity-100"
          />
        )}

        {/* Badges coin supérieur gauche */}
        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-ivoire">
              {t('product.new')}
            </span>
          )}
          {product.isSignature && (
            <span className="font-serif italic text-sm text-or">
              {t('product.signature')}
            </span>
          )}
        </div>

        {/* Quick action (hover) */}
        {!isCompact && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-noir/60 py-3 text-center backdrop-blur-sm transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire">
              {t('product.compose')}
            </span>
          </div>
        )}
      </div>

      {/* Métadonnées */}
      <div className="mt-4 flex flex-col gap-1">
        <h3
          className={cn(
            'font-serif font-light text-ivoire transition-colors duration-300 group-hover:text-or',
            isEditorial ? 'text-2xl md:text-3xl' : isCompact ? 'text-lg' : 'text-xl'
          )}
        >
          {product.name}
        </h3>
        {product.subtitle && !isCompact && (
          <p className="font-serif italic text-sm text-ivoire/60">
            {product.subtitle}
          </p>
        )}
        <p
          className={cn(
            'mt-1 font-sans tracking-[0.1em] text-ivoire/80',
            isEditorial ? 'text-base' : 'text-sm'
          )}
        >
          <Price
            cents={Math.round(product.price.amount * 100)}
            baseCurrency={product.price.currency}
          />
        </p>
      </div>
    </Link>
  );
}
