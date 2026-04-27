'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Package,
  Ruler,
  BookHeart,
  Sparkles,
  RotateCcw,
  Crown,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Le composant est un Client Component, mais ses props peuvent venir d'un
 * Server Component — donc on ne peut pas y faire passer un function component
 * d'icône directement (Next.js refuse). On passe un nom d'icône (string), et
 * on résout le composant ici.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  package: Package,
  ruler: Ruler,
  carnet: BookHeart,
  sparkles: Sparkles,
  rotate: RotateCcw,
  crown: Crown,
};

export type BenefitIconName =
  | 'package'
  | 'ruler'
  | 'carnet'
  | 'sparkles'
  | 'rotate'
  | 'crown';

type Benefit = {
  icon: BenefitIconName;
  label: string;
  body: string;
};

type Props = {
  benefits: Benefit[];
  /** Durée d'affichage par slide en ms. Default 6000. */
  intervalMs?: number;
};

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

/**
 * Carousel éditorial — une promesse à la fois, fade calme,
 * auto-advance avec pause au hover/focus, indicateur en chiffres romains.
 *
 * Codes éditoriaux print : pas de flèches "next/prev" criardes, pagination
 * minimaliste. Respecte prefers-reduced-motion (no auto-advance, fade plus
 * court).
 */
export function BenefitsCarousel({ benefits, intervalMs = 6000 }: Props) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const len = benefits.length;

  useEffect(() => {
    if (reduceMotion || paused || len === 0) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % len);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused, len, intervalMs]);

  // Pause au hover / focus
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onEnter = () => setPaused(true);
    const onLeave = () => setPaused(false);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('focusin', onEnter);
    el.addEventListener('focusout', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('focusin', onEnter);
      el.removeEventListener('focusout', onLeave);
    };
  }, []);

  // Navigation clavier
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActive((i) => (i + 1) % len);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActive((i) => (i - 1 + len) % len);
    }
  }

  if (len === 0) return null;
  const current = benefits[active]!;
  const Icon = ICON_MAP[current.icon];

  return (
    <div
      ref={wrapRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Avantages du compte"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="flex flex-col gap-10 focus:outline-none"
    >
      {/* Slide active — fade entre les bénéfices, hauteur stable */}
      <div
        className="relative min-h-[300px] md:min-h-[340px]"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="flex flex-col gap-5"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-serif italic text-[clamp(2rem,4vw,3rem)] leading-none text-or/40">
                {ROMAN[active] ?? `${active + 1}`}
              </span>
              <Icon
                className="h-7 w-7 shrink-0 self-center text-or"
                aria-hidden
              />
            </div>
            <h3 className="font-serif font-light leading-tight text-ivoire text-[clamp(1.75rem,3.5vw,2.5rem)]">
              {current.label}
            </h3>
            <p className="max-w-prose font-serif italic leading-relaxed text-ivoire/75 text-lg">
              {current.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicateurs — barres fines or, scaleX animée pour le slide actif */}
      <div className="flex items-center gap-3">
        {benefits.map((b, i) => (
          <button
            key={b.label}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Voir ${b.label}`}
            aria-current={i === active}
            data-cursor="hover"
            className={cn(
              'group relative h-px overflow-hidden transition-all duration-500 ease-out-expo',
              i === active ? 'w-12 bg-or' : 'w-6 bg-ivoire/20 hover:bg-ivoire/40'
            )}
          />
        ))}
        <span
          aria-hidden
          className="ml-2 font-sans text-[10px] uppercase tracking-[0.3em] text-ivoire/40"
        >
          {ROMAN[active]} / {ROMAN[len - 1] ?? len}
        </span>
      </div>
    </div>
  );
}
