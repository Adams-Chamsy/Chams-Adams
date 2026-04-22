'use client';

import Script from 'next/script';
import { useConsentStore } from '@/lib/store/consent.store';

/**
 * Tag Plausible Analytics. Deux conditions nécessaires pour être monté :
 *  1. `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` est défini
 *  2. L'utilisateur a consenti à la catégorie "analytics" (RGPD)
 *
 * Tant que l'une des deux manque, on ne rend rien — zéro tracking.
 */
export function PlausibleAnalytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const consented = useConsentStore((s) => s.accepted?.analytics);

  if (!domain || !consented) return null;

  return (
    <Script
      strategy="afterInteractive"
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
    />
  );
}
