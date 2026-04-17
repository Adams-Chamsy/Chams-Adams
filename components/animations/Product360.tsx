'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/animations/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export type Product360Props = {
  /**
   * Option A (futur) : URL du modèle .glb → activera le rendu React Three
   * Fiber en dynamic import. Non implémenté dans cette étape.
   */
  modelSrc?: string;
  /**
   * Option B : tableau d'URLs de frames (ex. 36 images à 10° d'intervalle).
   * Le composant cycle à travers ces frames au scroll.
   */
  spriteSrcs?: string[];
  /**
   * Image unique utilisée quand aucune sprite sheet n'est fournie.
   * Une simulation de rotation CSS (rotateY) est appliquée au scroll.
   */
  placeholderSrc: string;
  /** Texte alternatif pour les lecteurs d'écran. */
  alt: string;
  /** Nombre de rotations complètes (default 1). */
  rotations?: number;
  className?: string;
};

/**
 * Rotation 360° d'une pièce signature au scroll.
 *
 * - Option A : R3F + .glb (à implémenter plus tard — dynamic import avec ssr:false)
 * - Option B : sprite sheet de 36 frames (si `spriteSrcs` fournie)
 * - Fallback placeholder : une seule image + rotateY CSS (simulation)
 * - prefers-reduced-motion : rendu statique, aucune rotation
 *
 * Accessibilité :
 *  - aria-label descriptif
 *  - lecteurs d'écran ne voient qu'une seule image (les autres en aria-hidden)
 */
export function Product360({
  modelSrc,
  spriteSrcs,
  placeholderSrc,
  alt,
  rotations = 1,
  className,
}: Product360Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);
  const reducedMotion = useReducedMotion();

  const hasSprite = Array.isArray(spriteSrcs) && spriteSrcs.length > 0;
  const spriteCount = hasSprite ? spriteSrcs!.length : 0;

  useEffect(() => {
    if (reducedMotion) return;
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    if (!wrapper) return;

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        if (hasSprite) {
          const idx = Math.floor(p * rotations * spriteCount) % spriteCount;
          setFrame(idx < 0 ? idx + spriteCount : idx);
        } else if (stage) {
          const deg = p * rotations * 360 - 180;
          stage.style.transform = `rotateY(${deg}deg)`;
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [reducedMotion, hasSprite, spriteCount, rotations]);

  // Option A — réservé pour un futur commit (R3F + drei, dynamic import)
  if (modelSrc) {
    // TODO: implémenter le rendu R3F avec useGLTF + ScrollTrigger
    // Pour l'instant on retombe sur le placeholder pour éviter tout crash.
  }

  // Option B — sprite cycling
  if (hasSprite) {
    return (
      <div
        ref={wrapperRef}
        aria-label={alt}
        role="img"
        className={cn('relative aspect-[3/4] w-full', className)}
      >
        {spriteSrcs!.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className={cn(
              'absolute inset-0 h-full w-full object-contain transition-opacity duration-75',
              i === frame ? 'opacity-100' : 'opacity-0'
            )}
          />
        ))}
      </div>
    );
  }

  // Placeholder : une seule image + rotateY CSS
  return (
    <div
      ref={wrapperRef}
      className={cn('relative aspect-[3/4] w-full', className)}
      style={{ perspective: '1400px' }}
    >
      <div
        ref={stageRef}
        className="relative h-full w-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateY(-180deg)',
          willChange: 'transform',
        }}
      >
        <Image
          src={placeholderSrc}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 90vw, 50vw"
          className="object-contain"
          priority={false}
        />
      </div>
    </div>
  );
}
