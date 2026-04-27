'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/**
 * Transition de page "fade through black" — codes magazine print.
 *
 * À chaque CHANGEMENT de pathname (pas au premier mount) :
 *  1. Voile noir s'opacifie (160 ms)
 *  2. Maintien (40 ms) — instant suspendu
 *  3. Voile s'efface (480 ms ease-out-expo) → contenu nouvelle page révélé
 *
 * Implémentation : overlay fixe global, déclenché par usePathname.
 * Le premier mount est ignoré (sinon le voile masque la page d'arrivée et
 * peut interagir avec les animations d'entrée GSAP/ScrollTrigger).
 *
 * Respect strict de prefers-reduced-motion (composant retourne null).
 * Pas de blocage du clic : pointer-events-none toujours.
 */
export function PageTransition() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (reduce) return;
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setShow(true);
    const t = window.setTimeout(() => setShow(false), 200);
    return () => window.clearTimeout(t);
  }, [pathname, reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.19, 1, 0.22, 1],
          }}
          className="pointer-events-none fixed inset-0 z-[150] bg-noir"
        />
      )}
    </AnimatePresence>
  );
}
