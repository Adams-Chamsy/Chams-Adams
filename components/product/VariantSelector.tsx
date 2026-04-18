'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  SIZE_LABELS,
  type ProductSize,
  type ProductVariant,
} from '@/lib/types/product';

type Props = {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onVariantChange: (v: ProductVariant) => void;
  selectedSize: ProductSize | null;
  onSizeChange: (s: ProductSize) => void;
  onOpenSizeGuide?: () => void;
  className?: string;
};

/**
 * Sélecteur de variantes (couleur) + tailles.
 * - Pastilles de couleur : cercles 32×32, bordure or + offset quand actif
 * - Tailles : boutons carrés, disabled barré, sélectionné en or
 * - Lien "Guide des tailles" ouvre le drawer SizeGuide (piloté par le parent)
 */
export function VariantSelector({
  variants,
  selectedVariant,
  onVariantChange,
  selectedSize,
  onSizeChange,
  onOpenSizeGuide,
  className,
}: Props) {
  const showColorSection = variants.length > 1 || selectedVariant.colorName;
  const allSizes = selectedVariant.sizes;
  const isSurMesure = allSizes.length === 1 && allSizes[0] === 'sur-mesure';

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      {/* Couleurs */}
      {showColorSection && (
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-or/80">
              Couleur
            </span>
            <span className="font-serif italic text-sm text-ivoire/80">
              {selectedVariant.colorName}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {variants.map((v) => {
              const isActive = v.id === selectedVariant.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onVariantChange(v)}
                  aria-label={v.colorName}
                  aria-pressed={isActive}
                  data-cursor="hover"
                  title={v.colorName}
                  className={cn(
                    'group relative h-10 w-10 rounded-full border transition-all duration-300',
                    isActive
                      ? 'border-or ring-2 ring-or ring-offset-2 ring-offset-noir'
                      : 'border-bronze/40 hover:border-ivoire/60'
                  )}
                >
                  <span
                    className="block h-full w-full rounded-full"
                    style={{ backgroundColor: v.color }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tailles */}
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-or/80">
            Taille
          </span>
          {onOpenSizeGuide && !isSurMesure && (
            <button
              type="button"
              onClick={onOpenSizeGuide}
              data-cursor="hover"
              className="font-sans text-[11px] uppercase tracking-[0.2em] text-ivoire/70 underline-offset-4 transition-colors duration-300 hover:text-or hover:underline"
            >
              Guide des tailles
            </button>
          )}
        </div>

        {isSurMesure ? (
          <p className="font-serif italic text-ivoire/70">
            Cette pièce est composée sur-mesure. Toutes les mesures sont prises
            en atelier lors d&apos;un premier entretien.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as ProductSize[]).map((size) => {
              const available = allSizes.includes(size);
              const isActive = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => available && onSizeChange(size)}
                  disabled={!available}
                  aria-pressed={isActive}
                  data-cursor={available ? 'hover' : undefined}
                  className={cn(
                    'relative h-12 w-12 font-sans text-sm tracking-[0.1em] transition-all duration-300',
                    'border',
                    isActive && 'border-or bg-or text-noir',
                    !isActive && available && 'border-bronze/40 text-ivoire hover:border-or hover:text-or',
                    !available && 'cursor-not-allowed border-bronze/20 text-ivoire/40'
                  )}
                >
                  {SIZE_LABELS[size]}
                  {!available && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-2 top-1/2 h-px -translate-y-1/2 rotate-[-12deg] bg-ivoire/40"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Lien sur-mesure alternatif */}
        {!isSurMesure && (
          <Link
            href="/sur-mesure"
            data-cursor="hover"
            className="mt-1 inline-block font-serif italic text-sm text-or underline-offset-4 hover:underline"
          >
            Ou composer sur-mesure →
          </Link>
        )}
      </div>
    </div>
  );
}
