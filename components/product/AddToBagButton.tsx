'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  Product,
  ProductSize,
  ProductVariant,
} from '@/lib/types/product';

type Props = {
  product: Product;
  variant: ProductVariant;
  size: ProductSize | null;
  disabled?: boolean;
  className?: string;
  onAdded?: (payload: {
    productId: string;
    variantId: string;
    size: ProductSize;
  }) => void;
};

type Status = 'idle' | 'loading' | 'success';

/**
 * CTA principal de la fiche produit — gère 4 états visuels (idle, disabled,
 * loading, success). Pour étape 6, l'ajout est simulé (setTimeout 700ms) ;
 * l'intégration avec le store panier Zustand se fait en étape 7.
 */
export function AddToBagButton({
  product,
  variant,
  size,
  disabled,
  className,
  onAdded,
}: Props) {
  const [status, setStatus] = useState<Status>('idle');

  const isSurMesure = size === 'sur-mesure';
  const noSizeChosen = !size && !isSurMesure;
  const finalDisabled = disabled || noSizeChosen || status === 'loading';

  async function handleClick() {
    if (finalDisabled || !size) return;
    setStatus('loading');
    try {
      // TODO(étape 7) : brancher le store panier (Zustand).
      await new Promise((r) => setTimeout(r, 700));
      setStatus('success');
      onAdded?.({
        productId: product.id,
        variantId: variant.id,
        size,
      });
      // Revenir à l'état idle après 2.5s
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      setStatus('idle');
    }
  }

  let label: React.ReactNode = 'Ajouter à la sélection';
  if (noSizeChosen) label = <span className="italic">Choisir une taille</span>;
  else if (status === 'loading') {
    label = (
      <span className="inline-flex items-center gap-3">
        <span
          aria-hidden
          className="inline-block h-3 w-3 animate-spin rounded-full border border-ivoire/40 border-t-ivoire"
        />
        Ajout en cours…
      </span>
    );
  } else if (status === 'success') {
    label = (
      <span className="inline-flex items-center gap-2 text-or">
        <Check className="h-4 w-4" aria-hidden />
        Ajouté à la sélection
      </span>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={finalDisabled}
      aria-disabled={finalDisabled}
      data-cursor={finalDisabled ? undefined : 'magnetic'}
      whileTap={status === 'idle' ? { scale: 0.99 } : undefined}
      className={cn(
        'inline-flex w-full items-center justify-center border px-8 py-4 font-sans text-xs uppercase tracking-[0.2em] transition-all duration-500 ease-out-expo',
        status === 'success'
          ? 'border-or bg-noir text-or'
          : 'border-or bg-transparent text-ivoire hover:bg-or hover:text-noir hover:shadow-halo-or',
        finalDisabled && 'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-ivoire hover:shadow-none',
        className
      )}
      aria-live="polite"
    >
      {label}
    </motion.button>
  );
}
