'use client';

import { useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CATEGORY_LABELS,
  MATERIAL_LABELS,
  type ProductCategory,
  type ProductMaterial,
} from '@/lib/types/product';

export type FilterState = {
  categories: ProductCategory[];
  colors: string[];
  materials: ProductMaterial[];
  priceMin: number;
  priceMax: number;
  inStockOnly: boolean;
};

export const DEFAULT_FILTERS: FilterState = {
  categories: [],
  colors: [],
  materials: [],
  priceMin: 0,
  priceMax: 5000,
  inStockOnly: false,
};

const COLOR_OPTIONS: { hex: string; name: string }[] = [
  { hex: '#0A0A0A', name: 'Noir' },
  { hex: '#1B2951', name: 'Indigo' },
  { hex: '#F5F0E6', name: 'Ivoire' },
  { hex: '#B48F43', name: 'Or' },
  { hex: '#4A1520', name: 'Bordeaux' },
  { hex: '#4A3728', name: 'Bronze' },
];

// --------------------------------------------------------------------
// Helpers de modification de filtres (immutables)
// --------------------------------------------------------------------
function toggleInList<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function countActiveFilters(f: FilterState): number {
  return (
    f.categories.length +
    f.colors.length +
    f.materials.length +
    (f.priceMin > DEFAULT_FILTERS.priceMin ? 1 : 0) +
    (f.priceMax < DEFAULT_FILTERS.priceMax ? 1 : 0) +
    (f.inStockOnly ? 1 : 0)
  );
}

// --------------------------------------------------------------------
// Desktop sidebar
// --------------------------------------------------------------------

type DesktopProps = {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  resultCount: number;
  className?: string;
};

export function ProductFiltersSidebar({
  filters,
  onChange,
  resultCount,
  className,
}: DesktopProps) {
  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);

  return (
    <aside
      aria-label="Filtres de la boutique"
      className={cn('sticky top-28 hidden w-[280px] flex-shrink-0 self-start lg:block', className)}
    >
      <FiltersCore
        filters={filters}
        onChange={onChange}
        activeCount={activeCount}
        resultCount={resultCount}
      />
    </aside>
  );
}

// --------------------------------------------------------------------
// Mobile drawer (bottom sheet)
// --------------------------------------------------------------------

type MobileProps = {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  filters: FilterState;
  onChange: (f: FilterState) => void;
  resultCount: number;
};

export function ProductFiltersMobile({
  open,
  onClose,
  onOpen,
  filters,
  onChange,
  resultCount,
}: MobileProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
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

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        data-cursor="hover"
        className="inline-flex items-center gap-3 border border-bronze/40 px-5 py-3 font-sans text-xs uppercase tracking-[0.2em] text-ivoire transition-colors duration-300 hover:border-or hover:text-or lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden />
        Filtrer
        {activeCount > 0 && (
          <span
            aria-hidden
            className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-or px-1.5 text-[10px] font-medium text-noir"
          >
            {activeCount}
          </span>
        )}
        <span className="sr-only">({activeCount} filtres actifs)</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Filtres"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[150] lg:hidden"
          >
            <button
              type="button"
              aria-label="Fermer les filtres"
              onClick={onClose}
              className="absolute inset-0 bg-noir/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.45, ease: [0.77, 0, 0.175, 1] }}
              className="absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col overflow-hidden bg-noir"
            >
              <header className="flex items-center justify-between border-b border-bronze/15 px-6 py-5">
                <h2 className="font-serif text-xl font-light text-ivoire">Filtres</h2>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Fermer"
                  data-cursor="hover"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ivoire transition-colors duration-300 hover:text-or"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </header>
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <FiltersCore
                  filters={filters}
                  onChange={onChange}
                  activeCount={activeCount}
                  resultCount={resultCount}
                  hideResetOnTop
                />
              </div>
              <footer className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-bronze/15 bg-noir px-6 py-4">
                <button
                  type="button"
                  onClick={() => onChange(DEFAULT_FILTERS)}
                  data-cursor="hover"
                  className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/70 hover:text-or"
                >
                  Réinitialiser
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  data-cursor="magnetic"
                  className="btn-or flex-1 justify-center"
                >
                  Appliquer · {resultCount} pièces
                </button>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// --------------------------------------------------------------------
// Core (partagé desktop/mobile)
// --------------------------------------------------------------------

function FiltersCore({
  filters,
  onChange,
  activeCount,
  resultCount,
  hideResetOnTop,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  activeCount: number;
  resultCount: number;
  hideResetOnTop?: boolean;
}) {
  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-col gap-8">
      {!hideResetOnTop && (
        <div className="flex items-center justify-between">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/60">
            {resultCount} {resultCount > 1 ? 'pièces' : 'pièce'}
          </p>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => onChange(DEFAULT_FILTERS)}
              data-cursor="hover"
              className="font-sans text-[11px] uppercase tracking-[0.2em] text-or underline-offset-4 hover:underline"
            >
              Réinitialiser
            </button>
          )}
        </div>
      )}

      {/* Catégorie */}
      <FilterGroup title="Catégorie">
        <ul className="flex flex-col gap-3">
          {(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((cat) => (
            <li key={cat}>
              <CheckboxRow
                label={CATEGORY_LABELS[cat]}
                checked={filters.categories.includes(cat)}
                onChange={() => update('categories', toggleInList(filters.categories, cat))}
              />
            </li>
          ))}
        </ul>
      </FilterGroup>

      {/* Couleur */}
      <FilterGroup title="Couleur">
        <ul className="flex flex-col gap-3">
          {COLOR_OPTIONS.map((c) => (
            <li key={c.hex}>
              <CheckboxRow
                label={c.name}
                checked={filters.colors.includes(c.hex)}
                onChange={() => update('colors', toggleInList(filters.colors, c.hex))}
                swatch={c.hex}
              />
            </li>
          ))}
        </ul>
      </FilterGroup>

      {/* Matière */}
      <FilterGroup title="Matière">
        <ul className="flex flex-col gap-3">
          {(Object.keys(MATERIAL_LABELS) as ProductMaterial[]).map((m) => (
            <li key={m}>
              <CheckboxRow
                label={MATERIAL_LABELS[m]}
                checked={filters.materials.includes(m)}
                onChange={() => update('materials', toggleInList(filters.materials, m))}
              />
            </li>
          ))}
        </ul>
      </FilterGroup>

      {/* Prix */}
      <FilterGroup title="Prix">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between font-sans text-xs text-ivoire/80">
            <span>{filters.priceMin.toLocaleString('fr-FR')} €</span>
            <span>{filters.priceMax.toLocaleString('fr-FR')} €</span>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-ivoire/50">
                Minimum
              </span>
              <input
                type="range"
                min={0}
                max={5000}
                step={100}
                value={filters.priceMin}
                onChange={(e) =>
                  update(
                    'priceMin',
                    Math.min(Number(e.target.value), filters.priceMax - 100)
                  )
                }
                data-cursor="hover"
                className="accent-or"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-ivoire/50">
                Maximum
              </span>
              <input
                type="range"
                min={0}
                max={5000}
                step={100}
                value={filters.priceMax}
                onChange={(e) =>
                  update(
                    'priceMax',
                    Math.max(Number(e.target.value), filters.priceMin + 100)
                  )
                }
                data-cursor="hover"
                className="accent-or"
              />
            </label>
          </div>
        </div>
      </FilterGroup>

      {/* Disponibilité */}
      <FilterGroup title="Disponibilité">
        <CheckboxRow
          label="En disponibilité uniquement"
          checked={filters.inStockOnly}
          onChange={() => update('inStockOnly', !filters.inStockOnly)}
        />
      </FilterGroup>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details open className="group border-b border-bronze/15 pb-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-2 font-sans text-[11px] uppercase tracking-[0.25em] text-or/80">
        {title}
        <span
          aria-hidden
          className="inline-block h-px w-3 bg-ivoire transition-transform duration-300 group-open:rotate-90"
        />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
  swatch,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  swatch?: string;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3" data-cursor="hover">
      <span
        className={cn(
          'inline-flex h-4 w-4 shrink-0 items-center justify-center border transition-colors duration-300',
          checked ? 'border-or bg-or' : 'border-bronze/50 bg-transparent'
        )}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        {checked && (
          <span
            aria-hidden
            className="h-1.5 w-1.5 bg-noir"
          />
        )}
      </span>
      {swatch && (
        <span
          aria-hidden
          className="inline-block h-4 w-4 shrink-0 rounded-full border border-bronze/30"
          style={{ backgroundColor: swatch }}
        />
      )}
      <span className="font-serif text-sm text-ivoire/80 transition-colors duration-300 group-hover:text-ivoire">
        {label}
      </span>
    </label>
  );
}
