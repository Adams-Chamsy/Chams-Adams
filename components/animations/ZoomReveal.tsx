'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/animations/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export type ZoomRevealProps = {
  children: ReactNode;
  /** Tuple [scale de départ, scale d'arrivée]. Default [1, 1.4]. */
  scale?: [number, number];
  /** Origine du zoom, default center. */
  origin?: string;
  className?: string;
};

/**
 * Plongée caméra sur une image au scroll — de scale[0] à scale[1] (default 1 → 1.4).
 *
 * Technique : GSAP ScrollTrigger scrub entre `top bottom` et `bottom top`.
 * - `overflow-hidden` sur le wrapper pour clipper le débordement du zoom.
 * - `will-change: transform` + origine 3D pour l'accélération GPU.
 * - prefers-reduced-motion : rendu statique (pas de zoom).
 */
export function ZoomReveal({
  children,
  scale = [1, 1.4],
  origin = 'center center',
  className,
}: ZoomRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const [from, to] = scale;

  useEffect(() => {
    if (reducedMotion) return;
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    const tween = gsap.fromTo(
      inner,
      { scale: from },
      {
        scale: to,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [from, to, reducedMotion]);

  return (
    <div
      ref={wrapperRef}
      className={cn('relative overflow-hidden', className)}
    >
      <div
        ref={innerRef}
        className="h-full w-full will-change-transform"
        style={{ transformOrigin: origin }}
      >
        {children}
      </div>
    </div>
  );
}
