import { cn } from '@/lib/utils';

export type MarqueeProps = {
  /** Mots ou fragments à défiler, séparés par le séparateur visuel. */
  items: string[];
  /** Durée d'une rotation complète en secondes. Plus grand = plus lent. */
  durationSec?: number;
  /** Sens de défilement. */
  direction?: 'left' | 'right';
  /** Pause au survol. */
  pauseOnHover?: boolean;
  /** Classes à appliquer au conteneur. */
  className?: string;
};

/**
 * Marquee horizontal à défilement infini — signature éditoriale type bandeau
 * magazine. CSS-only (pas de JS), GPU-friendly.
 *
 * Astuce : on rend 2 copies du contenu, et on translate de -50 % sur la
 * durée — la boucle est invisible.
 */
export function Marquee({
  items,
  durationSec = 50,
  direction = 'left',
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'group relative flex w-full overflow-hidden border-y border-bronze/15 py-6 md:py-8',
        className
      )}
      style={
        {
          // Variable CSS custom pour piloter la durée depuis le composant
          // sans générer de classes Tailwind JIT runtime.
          '--marquee-duration': `${durationSec}s`,
        } as React.CSSProperties
      }
    >
      {/* Fondus latéraux pour entrée/sortie douce */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-noir to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-noir to-transparent"
      />

      <div className="flex shrink-0 animate-[marquee_var(--marquee-duration)_linear_infinite] items-center gap-16 whitespace-nowrap group-hover:[animation-play-state:paused] motion-reduce:animate-none"
           data-direction={direction}
      >
        {items.map((item, i) => (
          <MarqueeItem key={`a-${i}`} text={item} />
        ))}
      </div>
      <div className="flex shrink-0 animate-[marquee_var(--marquee-duration)_linear_infinite] items-center gap-16 whitespace-nowrap group-hover:[animation-play-state:paused] motion-reduce:animate-none"
           aria-hidden
      >
        {items.map((item, i) => (
          <MarqueeItem key={`b-${i}`} text={item} />
        ))}
      </div>
    </div>
  );
}

function MarqueeItem({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-16">
      <span className="font-serif italic text-ivoire/90 text-[clamp(1.25rem,2.5vw,2rem)] leading-none tracking-wide">
        {text}
      </span>
      <span
        aria-hidden
        className="inline-block h-1 w-1 shrink-0 rotate-45 bg-or/70"
      />
    </span>
  );
}
