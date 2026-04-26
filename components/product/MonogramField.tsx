'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  value: string;
  onChange: (v: string) => void;
  /** Surcharge tarifaire affichée (en €). */
  feeEuros?: number;
};

/**
 * Champ "Initiale brodée à la commande" — 1 à 3 caractères, A-Z.
 * Section repliée par défaut (pour ne pas alourdir la fiche).
 */
export function MonogramField({ value, onChange, feeEuros = 50 }: Props) {
  const [open, setOpen] = useState(value.length > 0);

  function handleChange(raw: string) {
    const clean = raw
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, 3);
    onChange(clean);
  }

  return (
    <div className="border-y border-bronze/15 py-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.25em] text-or">
          <Sparkles className="h-4 w-4" aria-hidden />
          Initiale brodée à la commande
        </span>
        <span
          aria-hidden
          className={cn(
            'inline-block h-px w-3 shrink-0 bg-ivoire transition-transform duration-300',
            open && 'rotate-90'
          )}
        />
      </button>

      {open && (
        <div className="mt-4 flex flex-col gap-3">
          <p className="font-serif italic text-sm text-ivoire/70">
            1 à 3 lettres brodées à la main, à l&apos;intérieur du col.
            Délai de confection allongé de 5 à 7 jours.
          </p>
          <div className="flex items-end gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-ivoire/60">
                Vos initiales
              </span>
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="ABC"
                maxLength={3}
                className="w-32 border-b border-bronze/40 bg-transparent py-1.5 text-center font-serif text-2xl uppercase tracking-[0.3em] text-or focus:border-or focus:outline-none"
              />
            </label>
            <span className="font-sans text-xs italic text-ivoire/60">
              {value
                ? `+${feeEuros} € — Brodée d'or`
                : `+${feeEuros} € si renseigné`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
