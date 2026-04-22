'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Barre de progression de lecture — fine ligne or qui se remplit au scroll.
 * Sticky top, pile au-dessus du Header (z-40, le Header est z-50 pour rester
 * visible au-dessus, mais la barre passe sous le Header de quelques px).
 *
 * Utilisée sur les pages d'articles du Journal pour donner le repère de
 * progression (pattern magazine).
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.3 });
  const [mounted, setMounted] = useState(false);

  // Évite le flicker SSR : on attend le mount pour afficher la barre
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <motion.span
      aria-hidden
      style={{ scaleX: smoothed, transformOrigin: '0 50%' }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px bg-or/80"
    />
  );
}
