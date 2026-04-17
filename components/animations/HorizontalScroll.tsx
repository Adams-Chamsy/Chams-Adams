'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { motion, useMotionValue, type MotionValue } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/animations/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type HScrollCtx = {
  /** 0 → 1 pendant la durée du pin horizontal (desktop uniquement). */
  progress: MotionValue<number>;
  /** True quand le pin est actif (desktop + non-reduced-motion). */
  active: MotionValue<number>;
};

const HorizontalScrollContext = createContext<HScrollCtx | null>(null);

export function useHorizontalScrollProgress() {
  const ctx = useContext(HorizontalScrollContext);
  if (!ctx) throw new Error('useHorizontalScrollProgress doit être utilisé dans <HorizontalScroll>');
  return ctx;
}

export type HorizontalScrollProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Wrapper générique qui transforme le scroll vertical en défilement horizontal pinné.
 *
 * Desktop (≥1024px) : GSAP ScrollTrigger pin le wrapper, translate le contenu en X.
 * Mobile / Tablette : layout en stack vertical classique, pas de pin.
 * prefers-reduced-motion : pas de pin, rendu stack vertical.
 *
 * Expose la progression 0→1 via React context (MotionValue) pour les composants
 * enfants (progress bar, indicateurs, etc.).
 *
 * Intégration GSAP :
 *  - matchMedia pour activer/désactiver selon breakpoint sans rebuild
 *  - invalidateOnRefresh pour recalculer au resize
 *  - anticipatePin: 1 pour éviter le flash au moment du pin
 */
export function HorizontalScroll({ children, className }: HorizontalScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const progress = useMotionValue(0);
  const active = useMotionValue(0);

  useEffect(() => {
    if (reducedMotion) return;
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const getDistance = () => content.scrollWidth - window.innerWidth;
      active.set(1);

      const tween = gsap.to(content, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => progress.set(self.progress),
        },
      });

      return () => {
        active.set(0);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    // Debounce du resize : évite les rafales de recalcul du pin.
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      mm.revert();
    };
  }, [reducedMotion, progress, active]);

  return (
    <HorizontalScrollContext.Provider value={{ progress, active }}>
      <div ref={wrapperRef} className={cn('relative overflow-hidden', className)}>
        <div
          ref={contentRef}
          className="flex flex-col lg:flex-row lg:flex-nowrap will-change-transform"
        >
          {children}
        </div>
      </div>
    </HorizontalScrollContext.Provider>
  );
}

/**
 * Barre de progression horizontale à placer à l'intérieur d'un `<HorizontalScroll>`.
 * Visible uniquement quand le pin est actif (desktop).
 */
export function HorizontalScrollProgress({
  labels,
  className,
}: {
  labels?: string[];
  className?: string;
}) {
  const { progress, active } = useHorizontalScrollProgress();
  const opacity = active;

  return (
    <motion.div
      aria-hidden
      style={{ opacity }}
      className={cn(
        'pointer-events-none hidden lg:block',
        'absolute inset-x-0 bottom-10 z-20',
        className
      )}
    >
      <div className="mx-auto flex max-w-content items-center gap-6 px-12">
        {labels && (
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-ivoire/60">
            {labels[0]}
          </span>
        )}
        <div className="relative h-px flex-1 bg-ivoire/20">
          <motion.div
            className="absolute inset-y-0 left-0 bg-or"
            style={{ scaleX: progress, transformOrigin: '0 0', width: '100%' }}
          />
        </div>
        {labels && (
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-ivoire/60">
            {labels[labels.length - 1]}
          </span>
        )}
      </div>
    </motion.div>
  );
}
