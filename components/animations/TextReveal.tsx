'use client';

import { createElement, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/animations/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

export type TextRevealProps = {
  as?: Tag;
  children: string;
  /**
   * Granularité du split. `lines` fallback sur `words` côté SSR (le split
   * réel par ligne nécessite une mesure DOM post-render — à implémenter plus
   * tard si besoin).
   */
  splitBy?: 'chars' | 'words' | 'lines';
  /** Délai global avant le début de la révélation (en secondes). */
  delay?: number;
  /** Délai entre chaque élément révélé (en secondes). */
  stagger?: number;
  /** Durée d'apparition de chaque élément (en secondes). */
  duration?: number;
  className?: string;
};

/**
 * Révèle un texte lettre-par-lettre, mot-par-mot ou ligne-par-ligne
 * au passage dans le viewport.
 *
 * - Accessibilité : le Tag porte `aria-label={children}` pour les lecteurs
 *   d'écran ; les spans de split sont `aria-hidden`.
 * - `prefers-reduced-motion: reduce` : rendu statique, pas de GSAP.
 * - Utilise un split manuel (pas GSAP SplitText, qui est premium) et anime
 *   chaque élément via `gsap.from` avec ScrollTrigger (`once: true`).
 */
export function TextReveal({
  as = 'h2',
  children,
  splitBy = 'words',
  delay = 0,
  stagger = 0.04,
  duration = 0.8,
  className,
}: TextRevealProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const root = rootRef.current;
    if (!root) return;

    const spans = root.querySelectorAll<HTMLSpanElement>('[data-reveal]');
    if (spans.length === 0) return;

    // État initial explicite — évite tout flash visible→invisible→visible.
    gsap.set(spans, { yPercent: 100, opacity: 0 });

    const tween = gsap.to(spans, {
      yPercent: 0,
      opacity: 1,
      duration,
      delay,
      stagger,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: root,
        start: 'top 90%',
        once: true,
      },
    });

    // Fallback : si après 1.5s le contenu reste invisible (ScrollTrigger n'a
    // pas évalué — cas Lenis qui tarde à initialiser, layout shift, etc.),
    // on force la révélation immédiate.
    const fallback = window.setTimeout(() => {
      const stillHidden = Array.from(spans).some(
        (s) =>
          parseFloat(getComputedStyle(s).opacity) === 0 ||
          getComputedStyle(s).transform.includes('matrix')
      );
      if (stillHidden) {
        gsap.to(spans, {
          yPercent: 0,
          opacity: 1,
          duration: 0.4,
          stagger,
          ease: 'power4.out',
        });
      }
    }, 1500);

    return () => {
      window.clearTimeout(fallback);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reducedMotion, delay, stagger, duration, children, splitBy]);

  // Rendu reduced-motion : texte brut, pas de spans.
  if (reducedMotion) {
    return createElement(as, { ref: rootRef, className }, children);
  }

  const items = splitText(children, splitBy);

  const setRef = (el: HTMLElement | null) => {
    rootRef.current = el;
  };

  // Accessibilité : texte complet en sr-only pour les lecteurs d'écran,
  // spans visuels en aria-hidden. Évite le problème `aria-label` interdit
  // sur <p>, <h*>, etc. (ARIA prohibited on non-interactive/non-landmark).
  return createElement(
    as,
    { ref: setRef, className },
    <>
      <span className="sr-only">{children}</span>
      <span aria-hidden className="inline-block">
        {items.map((item, i) => (
          <span
            key={i}
            className={cn(
              'relative inline-block overflow-hidden align-bottom',
              splitBy === 'words' ? 'mr-[0.28em] last:mr-0' : undefined
            )}
          >
            <span data-reveal className="inline-block will-change-transform">
              {item === ' ' ? '\u00A0' : item}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}

function splitText(
  text: string,
  mode: 'chars' | 'words' | 'lines'
): string[] {
  if (mode === 'chars') {
    // Préserve les graphemes composés (accents, emojis).
    return Array.from(text);
  }
  // `lines` fallback sur `words`.
  return text.split(/(\s+)/).filter((t) => t.length > 0 && !/^\s+$/.test(t));
}
