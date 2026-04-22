'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { PRODUCTS } from '@/lib/data/products.mock';
import { COLLECTIONS } from '@/lib/data/collections.mock';
import {
  CATEGORY_LABELS,
  formatPrice,
  getPrimaryImage,
  type Product,
  type Collection,
} from '@/lib/types/product';
import { cn } from '@/lib/utils';

type Props = {
  open: boolean;
  onClose: () => void;
};

type Results = {
  products: Product[];
  collections: Collection[];
};

/**
 * Modal de recherche — filtre Produits + Collections par nom / sous-titre /
 * description / matière / catégorie. Résultats groupés par type.
 * Suggestions de raccourcis quand le champ est vide.
 *
 * Remplacera un vrai moteur (Algolia / Meilisearch) + articles Journal
 * quand le CMS sera câblé.
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

  const results = useMemo<Results>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { products: [], collections: [] };

    const products = PRODUCTS.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        (p.subtitle ?? '').toLowerCase().includes(q) ||
        CATEGORY_LABELS[p.category].toLowerCase().includes(q) ||
        p.materials.some((m) => m.toLowerCase().includes(q)) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    }).slice(0, 9);

    const collections = COLLECTIONS.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }).slice(0, 4);

    return { products, collections };
  }, [query]);

  const totalResults = results.products.length + results.collections.length;

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
                  placeholder="Rechercher une pièce, une matière, une collection…"
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
              <div
                className="container-wide px-6 py-8 lg:px-12"
                aria-live="polite"
              >
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
                ) : totalResults === 0 ? (
                  <p className="font-serif italic text-ivoire/60 text-lg">
                    Rien ne correspond à «&nbsp;{query}&nbsp;». Essayez un autre
                    mot, ou parcourez nos{' '}
                    <Link
                      href="/collections"
                      onClick={onClose}
                      data-cursor="hover"
                      className="text-or underline-offset-4 hover:underline"
                    >
                      collections
                    </Link>
                    .
                  </p>
                ) : (
                  <div className="flex flex-col gap-10">
                    {/* Pièces */}
                    {results.products.length > 0 && (
                      <section>
                        <GroupHeader
                          label="Pièces"
                          count={results.products.length}
                        />
                        <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                          {results.products.map((p) => {
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
                      </section>
                    )}

                    {/* Collections */}
                    {results.collections.length > 0 && (
                      <section>
                        <GroupHeader
                          label="Collections"
                          count={results.collections.length}
                        />
                        <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                          {results.collections.map((c) => (
                            <li key={c.id}>
                              <Link
                                href={`/collections/${c.slug}`}
                                onClick={onClose}
                                data-cursor="hover"
                                className={cn(
                                  'group flex items-start gap-4 border border-transparent p-3 transition-colors duration-300',
                                  'hover:border-or/40'
                                )}
                              >
                                <div className="relative aspect-[4/5] w-16 flex-shrink-0 overflow-hidden bg-noir-800">
                                  <Image
                                    src={c.heroImage.url}
                                    alt={c.heroImage.alt}
                                    fill
                                    sizes="64px"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                </div>
                                <div className="flex min-w-0 flex-col gap-1">
                                  <span className="font-serif text-lg text-ivoire transition-colors duration-300 group-hover:text-or">
                                    {c.name}
                                  </span>
                                  <span className="font-serif italic text-sm text-ivoire/60">
                                    {c.tagline}
                                  </span>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GroupHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-bronze/20 pb-2">
      <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-or">
        {label}
      </p>
      <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/40">
        {count}
      </span>
    </div>
  );
}
