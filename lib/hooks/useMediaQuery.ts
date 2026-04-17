'use client';

import { useEffect, useState } from 'react';

/**
 * Hook utilitaire pour détecter un breakpoint / media query côté client.
 *
 * - Renvoie `false` en SSR (évite un flash du mauvais layout).
 * - Réactif : écoute les changements (resize, orientation).
 *
 * @example
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    setMatches(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, [query]);

  return matches;
}
