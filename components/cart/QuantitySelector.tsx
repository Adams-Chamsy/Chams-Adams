'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
};

/**
 * Sélecteur de quantité — boutons −/+ carrés + nombre centré.
 * Flèches clavier : ↑ et ↓ sur le champ pour incrémenter/décrémenter.
 */
export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
  size = 'sm',
  className,
}: QuantitySelectorProps) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  const buttonSize = size === 'md' ? 'h-10 w-10' : 'h-8 w-8';
  const textSize = size === 'md' ? 'text-base' : 'text-sm';
  const valueWidth = size === 'md' ? 'w-14' : 'w-12';

  return (
    <div
      role="group"
      aria-label="Quantité"
      className={cn('inline-flex items-center', className)}
    >
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label={`Diminuer la quantité (actuellement ${value})`}
        data-cursor="hover"
        className={cn(
          'inline-flex items-center justify-center border border-bronze/30 text-ivoire transition-colors duration-300',
          'hover:border-or hover:text-or',
          'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-bronze/30 disabled:hover:text-ivoire',
          buttonSize
        )}
      >
        <Minus className={size === 'md' ? 'h-4 w-4' : 'h-3 w-3'} aria-hidden />
      </button>

      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const v = Number.parseInt(e.target.value, 10);
          if (Number.isFinite(v)) onChange(Math.max(min, Math.min(max, v)));
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            inc();
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            dec();
          }
        }}
        aria-label="Quantité"
        data-cursor="hover"
        className={cn(
          'bg-transparent text-center font-sans tracking-[0.1em] text-ivoire focus:outline-none',
          '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          buttonSize,
          valueWidth,
          textSize
        )}
      />

      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label={`Augmenter la quantité (actuellement ${value})`}
        data-cursor="hover"
        className={cn(
          'inline-flex items-center justify-center border border-bronze/30 text-ivoire transition-colors duration-300',
          'hover:border-or hover:text-or',
          'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-bronze/30 disabled:hover:text-ivoire',
          buttonSize
        )}
      >
        <Plus className={size === 'md' ? 'h-4 w-4' : 'h-3 w-3'} aria-hidden />
      </button>
    </div>
  );
}
