'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWishlistCount, useWishlistStore } from '@/lib/store/wishlist.store';

/**
 * Icône cœur du Header — affiche le compteur de la wishlist et ouvre le
 * drawer dédié au clic. Animé en bounce quand le count change.
 */
export function WishlistButton({ className }: { className?: string }) {
  const count = useWishlistCount();
  const toggle = useWishlistStore((s) => s.toggleWishlist);
  const [mounted, setMounted] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setPulseKey((k) => k + 1);
  }, [count, mounted]);

  const display = mounted ? count : 0;
  const displayLabel = display > 99 ? '99+' : String(display);

  return (
    <button
      type="button"
      aria-label={`Wishlist, ${display} pièce${display > 1 ? 's' : ''}`}
      onClick={toggle}
      data-cursor="hover"
      className={cn(
        'group relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ivoire transition-colors duration-300 hover:text-or',
        className
      )}
    >
      <Heart
        className="h-[18px] w-[18px]"
        aria-hidden
        fill={display > 0 ? 'currentColor' : 'none'}
        strokeWidth={1.5}
      />
      {display > 0 && (
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
