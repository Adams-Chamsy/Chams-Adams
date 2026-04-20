'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWishlistStore, useWishlistCount } from '@/lib/store/wishlist.store';
import { formatPrice } from '@/lib/utils/price';

const LUXE_EASE: [number, number, number, number] = [0.77, 0, 0.175, 1];

/**
 * Drawer de la wishlist — slide depuis la droite, 420px desktop / 100vw mobile.
 * Layout minimal : liste compacte + lien vers chaque fiche produit.
 */
export function WishlistDrawer() {
  const isOpen = useWishlistStore((s) => s.isOpen);
  const close = useWishlistStore((s) => s.closeWishlist);
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.removeItem);
  const count = useWishlistCount();

  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = orig;
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="wishlist-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200]"
        >
          <motion.button
            type="button"
            aria-label="Fermer la wishlist"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-noir/60 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: LUXE_EASE }}
            className="absolute inset-y-0 right-0 flex h-full w-full max-w-[420px] flex-col bg-noir"
          >
            <header className="flex items-start justify-between border-b border-bronze/15 px-8 py-7">
              <div className="flex flex-col gap-1">
                <h2 id="wishlist-title" className="font-serif font-light text-ivoire text-3xl">
                  Près de vous
                </h2>
                <p className="font-serif italic text-ivoire/60">
                  {count === 0
                    ? 'Aucune pièce gardée'
                    : `${count} pièce${count > 1 ? 's' : ''} gardée${count > 1 ? 's' : ''}`}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Fermer"
                data-cursor="hover"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ivoire transition-colors duration-300 hover:text-or"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
                  <Heart className="h-10 w-10 text-or/60" strokeWidth={1.2} aria-hidden />
                  <p className="max-w-prose font-script text-4xl text-or">
                    Vos pièces favorites
                  </p>
                  <p className="max-w-prose font-serif italic text-ivoire/70">
                    Cliquez sur le cœur d&apos;une pièce pour la garder près de vous.
                  </p>
                  <Link
                    href="/boutique"
                    onClick={close}
                    data-cursor="magnetic"
                    className="btn-or mt-2"
                  >
                    Explorer la boutique
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col divide-y divide-bronze/15">
                  {items.map((item, i) => (
                    <motion.li
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.4, ease: LUXE_EASE, delay: i * 0.04 }}
                      className="flex gap-5 px-8 py-6"
                    >
                      <Link
                        href={`/produit/${item.productSlug}`}
                        onClick={close}
                        data-cursor="hover"
                        className="relative aspect-[4/5] w-20 flex-shrink-0 overflow-hidden bg-noir-800"
                      >
                        <Image
                          src={item.image.url}
                          alt={item.image.alt}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <Link
                          href={`/produit/${item.productSlug}`}
                          onClick={close}
                          data-cursor="hover"
                          className="truncate font-serif text-lg font-light text-ivoire transition-colors duration-300 hover:text-or"
                        >
                          {item.productName}
                        </Link>
                        {item.productSubtitle && (
                          <span className="truncate font-serif italic text-xs text-ivoire/60">
                            {item.productSubtitle}
                          </span>
                        )}
                        <span className="mt-1 font-sans text-sm tracking-[0.1em] text-ivoire/85">
                          {formatPrice(item.price, item.currency)}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(item.productId)}
                          data-cursor="hover"
                          className={cn(
                            'mt-2 self-start font-sans text-[11px] italic text-ivoire/60 underline-offset-4 transition-colors duration-300 hover:text-or hover:underline'
                          )}
                        >
                          Retirer
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
