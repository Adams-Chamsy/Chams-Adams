'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart.store';
import { centsFromAmount } from '@/lib/utils/price';
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
};

type Status = 'idle' | 'loading' | 'success';

/**
 * CTA principal de la fiche produit.
 * Au clic : ajoute au store Zustand `useCartStore`, ouvre le drawer,
 * affiche un état "Ajouté ✓" pendant 1.5 s puis revient à l'idle.
 *
 * Le compteur du Header et le drawer se mettent à jour en temps réel
 * via les hooks dérivés (useCartCount, useCartSubtotal).
 */
export function AddToBagButton({
  product,
  variant,
  size,
  disabled,
  className,
}: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const isSurMesure = size === 'sur-mesure';
  const noSizeChosen = !size && !isSurMesure;
  const finalDisabled = disabled || noSizeChosen || status === 'loading';

  async function handleClick() {
    if (finalDisabled || !size) return;
    setStatus('loading');

    try {
      // Micro-délai pour la sensation de progression (pas de vrai réseau ici)
      await new Promise((r) => setTimeout(r, 300));

      const primaryImage =
        variant.images.find((i) => i.isPrimary) ?? variant.images[0];
      if (!primaryImage) throw new Error('No variant image');

      addItem({
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        productSubtitle: product.subtitle,
        variantId: variant.id,
        variantColor: variant.color,
        variantColorName: variant.colorName,
        size,
        price: centsFromAmount(product.price.amount),
        currency: product.price.currency,
        image: {
          url: primaryImage.url,
          alt: primaryImage.alt,
        },
        quantity: 1,
      });

      setStatus('success');
      // Ouvre le drawer après un léger délai pour laisser le user voir le feedback
      setTimeout(() => {
        openCart();
      }, 400);
      setTimeout(() => setStatus('idle'), 1500);
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
        finalDisabled &&
          'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-ivoire hover:shadow-none',
        className
      )}
      aria-live="polite"
    >
      {label}
    </motion.button>
  );
}
