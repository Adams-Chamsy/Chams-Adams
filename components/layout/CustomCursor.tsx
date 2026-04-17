'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorState = 'default' | 'hover' | 'magnetic';

/**
 * Curseur signature : point doré + follower circulaire qui suit avec un léger lag.
 *
 * - Desktop uniquement (détecte `pointer: fine`). Invisible sur tactile.
 * - Désactivé si `prefers-reduced-motion: reduce`.
 * - Écoute les attributs `data-cursor="hover"` et `data-cursor="magnetic"`.
 *   Sur magnétique, le curseur est attiré vers le centre de l'élément (25 %).
 * - `mix-blend-mode: difference` sur le point pour qu'il reste lisible sur
 *   n'importe quel fond.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>('default');

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Point (dot) : ressort vif, quasi instantané.
  const dotX = useSpring(x, { stiffness: 900, damping: 50, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 900, damping: 50, mass: 0.2 });

  // Follower : ressort plus souple, lag doux (~0.1s).
  const followerX = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 });
  const followerY = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 });

  useEffect(() => {
    const pointerFine = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!pointerFine || reduceMotion) return;

    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    const onMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const magneticEl = target.closest<HTMLElement>('[data-cursor="magnetic"]');
      if (magneticEl) {
        const rect = magneticEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        // Glisse 25 % vers le centre de la cible.
        x.set(e.clientX + (cx - e.clientX) * 0.25);
        y.set(e.clientY + (cy - e.clientY) * 0.25);
        setState('magnetic');
        return;
      }

      x.set(e.clientX);
      y.set(e.clientY);

      const hoverEl = target.closest('[data-cursor="hover"], a, button, [role="button"]');
      setState(hoverEl ? 'hover' : 'default');
    };

    const onLeave = () => setState('default');

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [x, y]);

  if (!enabled) return null;

  const followerSize = state === 'hover' ? 60 : state === 'magnetic' ? 48 : 32;
  const followerOpacity = state === 'default' ? 0.45 : 0.7;

  return (
    <>
      {/* Point principal */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-or"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'difference',
        }}
      />
      {/* Follower */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border border-or"
        style={{
          x: followerX,
          y: followerY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: followerSize,
          height: followerSize,
          opacity: followerOpacity,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 22, mass: 0.5 }}
      />
    </>
  );
}
