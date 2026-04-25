'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Store de la devise d'affichage.
 *
 * Important : la facturation reste en EUR (Stripe). C'est uniquement
 * un confort visuel — un visiteur peut consulter les prix en XOF
 * (Afrique de l'Ouest) ou USD pour s'orienter, le checkout convertit
 * automatiquement vers la devise de la pièce (EUR par défaut).
 *
 * Taux indicatifs (2026) — à mettre à jour périodiquement ou brancher
 * sur une API (exchangerate.host) plus tard si besoin.
 */
export type Currency = 'EUR' | 'XOF' | 'USD';

export const CURRENCIES: { code: Currency; symbol: string; label: string }[] = [
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'XOF', symbol: 'FCFA', label: 'Franc CFA (Afrique de l’Ouest)' },
  { code: 'USD', symbol: '$', label: 'Dollar US' },
];

/** Taux de référence (1 EUR = N <devise>) */
export const RATES: Record<Currency, number> = {
  EUR: 1,
  XOF: 655.957, // taux fixe BCEAO
  USD: 1.08,
};

interface CurrencyStore {
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

const STORAGE_KEY = 'chams-currency';

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: 'EUR',
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Convertit un montant EUR cents vers la devise choisie et le formate.
 * Pour XOF, pas de décimales (la plus petite unité = 1 FCFA).
 */
export function convertAndFormat(
  cents: number,
  baseCurrency: Currency,
  displayCurrency: Currency,
  locale = 'fr-FR'
): string {
  const baseRate = RATES[baseCurrency];
  const targetRate = RATES[displayCurrency];
  const eur = cents / 100 / baseRate;
  const value = eur * targetRate;

  if (displayCurrency === 'XOF') {
    return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(
      Math.round(value)
    )} FCFA`;
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: displayCurrency,
    maximumFractionDigits: 0,
  }).format(value);
}
