'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { PRODUCTS } from '@/lib/data/products.mock';
import {
  CATEGORY_LABELS,
  formatPrice,
  getPrimaryImage,
  type Product,
} from '@/lib/types/product';
import { cn } from '@/lib/utils';

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Modal de recherche — filtre les produits mock par nom / sous-titre /
 * catégorie / matériau. Suggestions de raccourcis quand le champ est vide.
 *
 * Remplacera un vrai moteur (Algolia / Meilisearch) en étape d'optim.
 */
export function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setTimeout(() => inputRef.current?.focus(), 50);
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = orig;
    };
  }, [open, onClose]);

  const results = useMemo<Product[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        (p.subtitle ?? '').toLowerCase().includes(q) ||
        CATEGORY_LABELS[p.category].toLowerCase().includes(q) ||
        p.materials.some((m) => m.toLowerCase().includes(q)) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }).slice(0, 12);
  }, [query]);

  const shortcuts = [
    { label: 'Cérémonies', href: '/collections/ceremonies' },
    { label: 'Tabaski & Magal', href: '/collections/tabaski-magal' },
    { label: 'Sur-mesure', href: '/sur-mesure' },
    { label: 'L’Aïcha (signature)', href: '/produit/l-aicha' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Rechercher"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200]"
        >
          <motion.button
            type="button"
            aria-label="Fermer la recherche"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-noir/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
            className="absolute inset-x-0 top-0 flex max-h-[80vh] flex-col border-b border-bronze/20 bg-noir"
          >
            {/* Barre de recherche */}
            <div className="border-b border-bronze/15">
              <div className="container-wide flex items-center gap-4 px-6 py-5 lg:px-12">
                <Search className="h-5 w-5 text-or" aria-hidden />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher une pièce, une matière, une occasion…"
                  aria-label="Rechercher"
                  data-cursor="hover"
                  className="min-w-0 flex-1 bg-transparent font-serif text-xl text-ivoire placeholder:text-ivoire/40 focus:outline-none md:text-2xl"
                />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fermer"
                  data-cursor="hover"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ivoire transition-colors duration-300 hover:text-or"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </div>

            {/* Résultats */}
            <div className="flex-1 overflow-y-auto">
              <div className="container-wide px-6 py-8 lg:px-12">
                {query.trim() === '' ? (
                  <div className="flex flex-col gap-4">
                    <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-or/80">
                      Raccourcis
                    </p>
                    <ul className="flex flex-wrap gap-3">
                      {shortcuts.map((s) => (
                        <li key={s.href}>
                          <Link
                            href={s.href}
                            onClick={onClose}
                            data-cursor="hover"
                            className="inline-flex items-center border border-bronze/40 px-4 py-2 font-serif italic text-ivoire transition-all duration-300 hover:border-or hover:text-or"
                          >
                            {s.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : results.length === 0 ? (
                  <p className="font-serif italic text-ivoire/60 text-lg">
                    Aucune pièce ne correspond à « {query} ».
                  </p>
                ) : (
                  <ul className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map((p) => {
                      const img = getPrimaryImage(p);
                      return (
                        <li key={p.id}>
                          <Link
                            href={`/produit/${p.slug}`}
                            onClick={onClose}
                            data-cursor="hover"
                            className="group flex items-center gap-4"
                          >
                            <div className="relative aspect-[4/5] w-20 flex-shrink-0 overflow-hidden bg-noir-800">
                              <Image
                                src={img.url}
                                alt={img.alt}
                                fill
                                sizes="80px"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <div className="flex min-w-0 flex-col gap-1">
                              <span className="font-serif text-lg text-ivoire transition-colors duration-300 group-hover:text-or">
                                {p.name}
                              </span>
                              {p.subtitle && (
                                <span className="truncate font-serif italic text-sm text-ivoire/60">
                                  {p.subtitle}
                                </span>
                              )}
                              <span className="font-sans text-xs tracking-[0.1em] text-ivoire/60">
                                {formatPrice(p.price)}
                              </span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
