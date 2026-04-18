'use client';

import { useEffect, useState, type RefObject } from 'react';

export type UseIntersectionObserverOptions = {
  /** Élément utilisé comme viewport. Default : window. */
  root?: Element | Document | null;
  /** Marges autour du root. */
  rootMargin?: string;
  /** Fraction(s) de l'élément qui doivent être visibles pour déclencher. */
  threshold?: number | number[];
  /** Si vrai (default), arrête d'observer dès la première intersection. */
  once?: boolean;
};

/**
 * Hook léger pour détecter l'entrée d'un élément dans le viewport.
 *
 * - Renvoie `false` en SSR.
 * - Se déconnecte après la première intersection si `once` (default).
 * - Ne pas passer un objet d'options créé à chaque render (il serait stable
 *   par ses valeurs grâce à JSON.stringify, mais pour la propreté préférer
 *   un `const` hors composant).
 */
export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    once = true,
  }: UseIntersectionObserverOptions = {}
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { root: root as Element | null, rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // threshold peut être un array — on le stringify pour comparer par valeur.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, root, rootMargin, JSON.stringify(threshold), once]);

  return inView;
}
