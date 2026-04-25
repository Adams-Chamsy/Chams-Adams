'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CURRENCIES,
  useCurrencyStore,
  type Currency,
} from '@/lib/store/currency.store';

/**
 * Sélecteur de devise — affichage uniquement, le checkout reste en EUR.
 * Persiste sur localStorage via le store.
 */
export function CurrencyButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function select(c: Currency) {
    setCurrency(c);
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-label="Devise"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        data-cursor="hover"
        className="group inline-flex h-10 w-10 items-center justify-center rounded-full text-ivoire transition-colors duration-300 hover:text-or"
      >
        <Coins className="h-[18px] w-[18px]" aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 z-[60] min-w-[240px] border border-bronze/30 bg-noir py-2 shadow-editorial"
          >
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                type="button"
                role="menuitem"
                onClick={() => select(c.code)}
                aria-current={currency === c.code}
                className={cn(
                  'flex w-full items-center justify-between gap-4 px-5 py-2.5 text-left font-sans text-sm transition-colors duration-200',
                  currency === c.code
                    ? 'text-or'
                    : 'text-ivoire hover:bg-ivoire/[0.03] hover:text-or'
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="font-sans text-xs uppercase tracking-[0.2em]">
                    {c.code}
                  </span>
                  <span className="font-serif italic">{c.label}</span>
                </span>
                {currency === c.code && (
                  <span
                    aria-hidden
                    className="font-sans text-[10px] uppercase tracking-[0.15em] text-or"
                  >
                    ✓
                  </span>
                )}
              </button>
            ))}
            <p className="mt-1 border-t border-bronze/20 px-5 py-2 font-serif text-[11px] italic text-ivoire/50">
              Affichage uniquement. Paiement sécurisé en euros.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
