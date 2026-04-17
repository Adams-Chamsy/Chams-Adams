'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/animations/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export type FabricTransitionProps = {
  /** Couleur du remplissage (par défaut : noir — couleur de la section suivante). */
  color?: string;
  /** Inverse la courbe pour transiter d'une section sombre vers une section claire. */
  flip?: boolean;
  className?: string;
};

/**
 * Transition visuelle évoquant un drapé de tissu — SVG pleine largeur dont
 * les points de contrôle Bezier ondulent légèrement au scroll (morphing subtil).
 *
 * `prefers-reduced-motion: reduce` : courbe statique, pas d'animation.
 */
export function FabricTransition({
  color = '#0A0A0A',
  flip = false,
  className,
}: FabricTransitionProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  // Deux états de la courbe : les points de contrôle inversent leur hauteur.
  const pathA = flip
    ? 'M0,140 C320,80 640,200 960,140 C1280,80 1600,200 1920,140 L1920,0 L0,0 Z'
    : 'M0,60 C320,120 640,0 960,60 C1280,120 1600,0 1920,60 L1920,200 L0,200 Z';
  const pathB = flip
    ? 'M0,100 C320,160 640,40 960,100 C1280,160 1600,40 1920,100 L1920,0 L0,0 Z'
    : 'M0,100 C320,40 640,160 960,100 C1280,40 1600,160 1920,100 L1920,200 L0,200 Z';

  useEffect(() => {
    if (reducedMotion) return;
    const path = pathRef.current;
    const svg = svgRef.current;
    if (!path || !svg) return;

    const tween = gsap.to(path, {
      attr: { d: pathB },
      ease: 'none',
      scrollTrigger: {
        trigger: svg,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reducedMotion, pathB]);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      viewBox="0 0 1920 200"
      preserveAspectRatio="none"
      className={cn(
        'relative -my-px block w-full',
        flip ? 'rotate-180' : '',
        className
      )}
      style={{ height: 'clamp(60px, 10vw, 160px)' }}
    >
      <path ref={pathRef} d={pathA} fill={color} />
    </svg>
  );
}
