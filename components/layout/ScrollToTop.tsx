'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useReducedMotion } from '@/lib/animations/useReducedMotion';

const LUXE_EASE: [number, number, number, number] = [0.19, 1, 0.22, 1];
const SHOW_AT = 800;

type LenisLike = {
  scrollTo: (target: number, opts?: { duration?: number }) => void;
};

/**
 * Bouton flottant de retour en haut de page. Apparaît après 800 px de scroll.
 * Compatible Lenis : si `window.__lenis` est disponible (exposé par
 * <SmoothScroll>), on utilise son `scrollTo`, sinon on retombe sur le scroll
 * natif smooth. `prefers-reduced-motion` => scroll immédiat (instant).
 */
export function ScrollToTop() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AT);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleClick() {
    if (typeof window === 'undefined') return;
    if (reducedMotion) {
      window.scrollTo(0, 0);
      return;
    }
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label="Revenir en haut de page"
          data-cursor="hover"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: LUXE_EASE }}
          className="fixed bottom-6 right-6 z-[200] inline-flex h-12 w-12 items-center justify-center rounded-full border border-or/40 bg-noir/80 text-or backdrop-blur-sm transition-colors duration-500 ease-out-expo hover:border-or hover:bg-or hover:text-noir focus:outline-none focus-visible:ring-2 focus-visible:ring-or focus-visible:ring-offset-2 focus-visible:ring-offset-noir md:h-14 md:w-14"
        >
          <ArrowUp className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
