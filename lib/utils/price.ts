/**
 * Helpers de formatage prix — source unique pour éviter les divergences
 * d'affichage (espace insécable avant €, séparateur des milliers, etc.)
 */

/**
 * Formate un montant en cents en string prêt pour l'affichage.
 *
 * @param cents Montant en cents (plus petite unité)
 * @param currency Code ISO 4217 (EUR, USD, XOF, ...)
 * @param locale Default 'fr-FR'
 *
 * @example
 * formatPrice(280000, 'EUR') // "2 800 €"
 * formatPrice(280000, 'USD', 'en-US') // "$2,800"
 */
export function formatPrice(
  cents: number,
  currency: string = 'EUR',
  locale: string = 'fr-FR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/** Convertit un montant en unité principale vers des cents. */
export function centsFromAmount(amount: number): number {
  return Math.round(amount * 100);
}

/** Convertit des cents vers une unité principale (float). */
export function amountFromCents(cents: number): number {
  return cents / 100;
}
