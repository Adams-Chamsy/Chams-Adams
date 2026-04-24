'use client';

import { useMemo, useState } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import {
  ProductFiltersSidebar,
  ProductFiltersMobile,
  DEFAULT_FILTERS,
  type FilterState,
  type ColorOption,
} from '@/components/product/ProductFilters';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';
import { useRef } from 'react';
import type { Product } from '@/lib/types/product';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Nouveautés' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'name', label: 'Nom' },
];

const PAGE_SIZE = 6;

type BoutiqueClientProps = {
  products: Product[];
};

export function BoutiqueClient({ products }: BoutiqueClientProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => applyFilters(products, filters), [products, filters]);
  const sorted = useMemo(() => applySort(filtered, sort), [filtered, sort]);

  // Options couleur dynamiques : une entrée par hex unique rencontré dans
  // les variantes. Le label prend le premier `colorName` trouvé.
  const colorOptions = useMemo<ColorOption[]>(() => {
    const map = new Map<string, string>();
    for (const p of products) {
      for (const v of p.variants) {
        if (v.color && !map.has(v.color)) {
          map.set(v.color, v.colorName || v.color);
        }
      }
    }
    return Array.from(map.entries())
      .map(([hex, name]) => ({ hex, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }, [products]);
  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  // Infinite scroll — on attache l'observer à un sentinel en bas de la grille.
  const sentinelInView = useIntersectionObserver(sentinelRef, {
    rootMargin: '200px',
    once: false,
  });

  if (sentinelInView && hasMore) {
    // Évite les re-renders en boucle — incrémente simplement si visible change.
    setTimeout(() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, sorted.length)), 0);
  }

  return (
    <>
      {/* Header compact */}
      <section className="bg-noir pt-[140px] pb-[40px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Boutique' },
            ]}
          />
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
            <div className="flex flex-col gap-3">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
                Toutes les pièces
              </span>
              <TextReveal
                as="h1"
                splitBy="words"
                stagger={0.06}
                className="font-serif font-light leading-tight text-ivoire text-[clamp(2.5rem,5vw,4.5rem)]"
              >
                Boutique
              </TextReveal>
              <p className="font-serif italic text-ivoire/70 text-lg md:text-xl">
                L&apos;intégralité de nos pièces disponibles.
              </p>
            </div>

            {/* Tri */}
            <label className="flex items-center gap-3">
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/60">
                Trier par
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                data-cursor="hover"
                className="border-b border-bronze/40 bg-transparent py-2 pr-8 font-serif italic text-ivoire focus:border-or focus:outline-none"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-noir text-ivoire">
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      {/* Filtres mobile trigger */}
      <section className="bg-noir pb-6 lg:hidden">
        <div className="container-content flex items-center justify-between">
          <ProductFiltersMobile
            open={mobileFiltersOpen}
            onOpen={() => setMobileFiltersOpen(true)}
            onClose={() => setMobileFiltersOpen(false)}
            filters={filters}
            onChange={(f) => {
              setFilters(f);
              setVisibleCount(PAGE_SIZE);
            }}
            resultCount={sorted.length}
            colorOptions={colorOptions}
          />
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/60">
            {sorted.length} pièces
          </p>
        </div>
      </section>

      {/* Layout principal */}
      <section className="bg-noir pb-[160px]">
        <div className="container-content flex flex-col gap-10 lg:flex-row lg:gap-12">
          <ProductFiltersSidebar
            filters={filters}
            onChange={(f) => {
              setFilters(f);
              setVisibleCount(PAGE_SIZE);
            }}
            resultCount={sorted.length}
            colorOptions={colorOptions}
          />

          <div className="min-w-0 flex-1">
            <h2 className="sr-only">Nos pièces disponibles</h2>
            {sorted.length === 0 ? (
              <p className="mt-12 font-serif italic text-ivoire/60">
                Aucune pièce ne correspond à votre sélection.
              </p>
            ) : (
              <>
                <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
                  {visible.map((p, i) => (
                    <li key={p.id}>
                      <ProductCard product={p} priority={i < 3} />
                    </li>
                  ))}
                </ul>
                {hasMore && (
                  <div
                    ref={sentinelRef}
                    aria-hidden
                    className="mt-12 flex h-16 items-center justify-center"
                  >
                    <span className="font-sans text-xs italic tracking-wide text-ivoire/60">
                      Chargement des suivantes…
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

// --------------------------------------------------------------------
// Filtrage + tri
// --------------------------------------------------------------------

function applyFilters(products: Product[], f: FilterState): Product[] {
  return products.filter((p) => {
    if (f.categories.length > 0 && !f.categories.includes(p.category)) return false;
    if (f.materials.length > 0 && !p.materials.some((m) => f.materials.includes(m))) return false;
    if (f.colors.length > 0 && !p.variants.some((v) => f.colors.includes(v.color))) return false;
    if (p.price.amount < f.priceMin || p.price.amount > f.priceMax) return false;
    if (f.inStockOnly) {
      const anyInStock = p.variants.some((v) => v.stock === undefined || v.stock > 0);
      if (!anyInStock) return false;
    }
    return true;
  });
}

function applySort(products: Product[], sort: SortOption): Product[] {
  const copy = [...products];
  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false));
    case 'price-asc':
      return copy.sort((a, b) => a.price.amount - b.price.amount);
    case 'price-desc':
      return copy.sort((a, b) => b.price.amount - a.price.amount);
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }
}
