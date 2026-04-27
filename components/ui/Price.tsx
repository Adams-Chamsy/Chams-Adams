'use client';

import { convertAndFormat, useCurrencyStore } from '@/lib/store/currency.store';
import { cn } from '@/lib/utils';

type Props = {
  /** Montant en cents dans la devise source (typiquement EUR). */
  cents: number;
  /** Devise du montant source. Default: 'EUR'. */
  baseCurrency?: 'EUR' | 'XOF' | 'USD';
  className?: string;
};

/**
 * Affiche un prix dans la devise sélectionnée par l'utilisateur (header).
 * Le calcul reste indicatif — le checkout est facturé en EUR.
 */
export function Price({ cents, baseCurrency = 'EUR', className }: Props) {
  const currency = useCurrencyStore((s) => s.currency);
  return (
    <span className={cn('nums-tabular', className)}>
      {convertAndFormat(cents, baseCurrency, currency)}
    </span>
  );
}
