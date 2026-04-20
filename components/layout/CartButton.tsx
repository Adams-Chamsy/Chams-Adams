'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartCount, useCartStore } from '@/lib/store/cart.store';

/**
 * Bouton panier du Header — icône + badge lié au store Zustand.
 * - Au clic : toggleCart()
 * - Badge animé en bounce quand le count change (scale 1 → 1.3 → 1 en 300ms)
 * - count > 99 : affichage "99+"
 * - SSR-safe : pendant l'hydration, on affiche 0 pour éviter les mismatchs.
 */
export function CartButton({ className }: { className?: string }) {
  const count = useCartCount();
  const toggleCart = useCartStore((s) => s.toggleCart);

  const [mounted, setMounted] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Déclenche le bounce quand count change (hors premier render)
  useEffect(() => {
    if (!mounted) return;
    setPulseKey((k) => k + 1);
  }, [count, mounted]);

  const displayCount = mounted ? count : 0;
  const displayLabel = displayCount > 99 ? '99+' : String(displayCount);

  return (
    <button
      type="button"
      aria-label={`Sélection, ${displayCount} pièce${displayCount > 1 ? 's' : ''}`}
      onClick={toggleCart}
      data-cursor="hover"
      className={cn(
        'group relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ivoire transition-colors duration-300 hover:text-or',
        className
      )}
    >
      <ShoppingBag className="h-[18px] w-[18px]" aria-hidden />
      {displayCount > 0 && (
        <motion.span
          key={pulseKey}
          initial={{ scale: 1 }}
          animate={{ scale: [1.3, 1] }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
          aria-hidden
          className="absolute -right-0.5 -top-0.5 inline-flex min-w-4 items-center justify-center rounded-full border border-noir bg-or px-1 text-[10px] font-medium leading-4 text-noir"
        >
          {displayLabel}
        </motion.span>
      )}
    </button>
  );
}
