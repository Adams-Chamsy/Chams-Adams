'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useCartStore,
  useCartCount,
  useCartSubtotal,
} from '@/lib/store/cart.store';
import { formatPrice } from '@/lib/utils/price';
import { QuantitySelector } from './QuantitySelector';

const LUXE_EASE: [number, number, number, number] = [0.77, 0, 0.175, 1];

/**
 * Drawer du panier — contrôlé par useCartStore.isOpen.
 * Slide depuis la droite, full-height, 440px desktop / 100vw mobile.
 *
 * - Focus trap (focus → close button à l'ouverture)
 * - ESC pour fermer, backdrop click pour fermer
 * - Body-scroll lock pendant l'ouverture
 * - Liste des items : stagger fade-in quand le drawer s'ouvre
 * - Suppression : slide-out à droite + collapse
 */
export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const count = useCartCount();
  const subtotal = useCartSubtotal();

  const closeRef = useRef<HTMLButtonElement>(null);
  const currency = items[0]?.currency ?? 'EUR';

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = orig;
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200]"
        >
          {/* Overlay */}
          <motion.button
            type="button"
            aria-label="Fermer la sélection"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-noir/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: LUXE_EASE }}
            className="absolute inset-y-0 right-0 flex h-full w-full max-w-[440px] flex-col bg-noir"
          >
            {/* Header */}
            <header className="flex items-start justify-between border-b border-bronze/15 px-8 py-7">
              <div className="flex flex-col gap-1">
                <h2
                  id="cart-drawer-title"
                  className="font-serif font-light text-ivoire text-3xl"
                >
                  Ma sélection
                </h2>
                <p className="font-serif italic text-ivoire/60">
                  {count === 0
                    ? 'Aucune pièce'
                    : `${count} pièce${count > 1 ? 's' : ''}`}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={closeCart}
                aria-label="Fermer"
                data-cursor="hover"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ivoire transition-colors duration-300 hover:text-or"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </header>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? <EmptyState onClose={closeCart} /> : (
                <ul className="flex flex-col divide-y divide-bronze/15">
                  {items.map((item, i) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100, height: 0, marginTop: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: LUXE_EASE,
                        delay: i * 0.05,
                      }}
                      className="flex gap-5 px-8 py-6"
                    >
                      <div className="relative aspect-[4/5] w-20 flex-shrink-0 overflow-hidden bg-noir-800">
                        <Image
                          src={item.image.url}
                          alt={item.image.alt}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 flex-col">
                            <Link
                              href={`/produit/${item.productSlug}`}
                              onClick={closeCart}
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
                            <span className="mt-1 font-sans text-[11px] uppercase tracking-[0.15em] text-ivoire/60">
                              {item.variantColorName} · Taille {item.size}
                            </span>
                          </div>
                          <p className="whitespace-nowrap font-sans text-sm tracking-[0.1em] text-ivoire">
                            {formatPrice(item.price * item.quantity, item.currency)}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <QuantitySelector
                            value={item.quantity}
                            onChange={(q) => updateQuantity(item.id, q)}
                          />
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            data-cursor="hover"
                            className="font-sans text-[11px] italic text-ivoire/60 underline-offset-4 transition-colors duration-300 hover:text-or hover:underline"
                          >
                            Retirer
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <footer className="flex flex-col gap-5 border-t border-bronze/15 bg-noir px-8 py-7">
                <div className="flex items-baseline justify-between">
                  <span className="font-sans text-sm uppercase tracking-[0.25em] text-ivoire/70">
                    Sous-total
                  </span>
                  <span className="font-sans text-lg tracking-[0.1em] text-ivoire">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>
                <p className="font-sans text-[11px] italic text-ivoire/50">
                  Livraison et taxes calculées au paiement.
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  data-cursor="magnetic"
                  className={cn(
                    'inline-flex w-full items-center justify-center border border-or bg-or px-8 py-4',
                    'font-sans text-xs uppercase tracking-[0.2em] text-noir',
                    'transition-all duration-500 ease-out-expo hover:shadow-halo-or-strong'
                  )}
                >
                  Procéder au paiement
                </Link>
                <button
                  type="button"
                  onClick={closeCart}
                  data-cursor="hover"
                  className="font-sans text-xs italic underline-offset-4 text-ivoire/70 hover:text-or hover:underline"
                >
                  Poursuivre la sélection
                </button>
                <p className="inline-flex items-center justify-center gap-2 font-sans text-[10px] uppercase tracking-[0.25em] text-ivoire/40">
                  <Lock className="h-3 w-3" aria-hidden />
                  Paiement sécurisé par Stripe
                </p>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
      <p className="font-script text-5xl text-or">Votre sélection est vide</p>
      <p className="max-w-prose font-serif italic text-ivoire/70">
        Découvrez nos collections.
      </p>
      <Link
        href="/boutique"
        onClick={onClose}
        data-cursor="magnetic"
        className="btn-or mt-2"
      >
        Explorer la boutique
      </Link>
    </div>
  );
}
