'use client';

import { useEffect, useState } from 'react';

/**
 * Retourne `true` si l'utilisateur préfère réduire les animations
 * (`prefers-reduced-motion: reduce`).
 *
 * - Renvoie `false` pendant le rendu serveur (pas de layout-shift côté SSR).
 * - Réactif : écoute les changements de la media-query.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    // Safari <14 utilise addListener ; les autres addEventListener.
    if (mq.addEventListener) {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  return reduced;
}
