'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/animations/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export type ParallaxLayerProps = {
  children: React.ReactNode;
  /** Multiplicateur de décalage. 0 = pas de parallax, 1 = décalage = hauteur. Négatif = inversé. */
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  className?: string;
};

/**
 * Couche à effet parallax basée sur GSAP ScrollTrigger (`scrub: true`).
 *
 * - `will-change: transform` + translate3D pour accélération GPU.
 * - `prefers-reduced-motion: reduce` : parallax désactivé, rendu statique.
 * - Cleanup complet au démontage (ScrollTrigger + tween).
 */
export function ParallaxLayer({
  children,
  speed = 0.5,
  direction = 'vertical',
  className,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const axis = direction === 'vertical' ? 'yPercent' : 'xPercent';

    const tween = gsap.fromTo(
      el,
      { [axis]: 0 },
      {
        [axis]: -speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed, direction, reducedMotion]);

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  );
}
