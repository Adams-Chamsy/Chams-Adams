'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextReveal } from '@/components/animations/TextReveal';
import { useReducedMotion } from '@/lib/animations/useReducedMotion';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const POSTER = '/videos/hero-placeholder-poster.svg';
const VIDEO_SRC = '/videos/hero-placeholder.mp4';

/**
 * Hero cinématique — entrée en scène du site.
 *
 * PHASE 1 (entrée) :
 *  - Vidéo fullscreen autoPlay muted loop + poster fallback
 *  - Eyebrow / titre TextReveal char-par-char / sous-titre / CTA magnétique
 *  - Indicateur de scroll animé
 *
 * PHASE 2 (scroll) :
 *  - Zoom léger sur la vidéo (scale 1 → 1.1)
 *  - Overlay sombre qui s'intensifie (0.8 → 0.95)
 *  - Contenu textuel qui disparaît progressivement
 *
 * Accessibilité :
 *  - Vidéo aria-hidden (décorative), bouton mute focusable
 *  - prefers-reduced-motion : vidéo remplacée par le poster fixe
 *  - CTA est le premier élément focusable du contenu
 */
export function HeroCinematic() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [muted, setMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    if (videoRef.current) {
      tl.to(videoRef.current, { scale: 1.1, ease: 'none' }, 0);
    }
    if (overlayRef.current) {
      tl.to(overlayRef.current, { opacity: 0.95, ease: 'none' }, 0);
    }
    if (contentRef.current) {
      tl.to(contentRef.current, { y: -80, opacity: 0, ease: 'none' }, 0);
    }
    if (hintRef.current) {
      tl.to(hintRef.current, { opacity: 0, ease: 'none' }, 0.1);
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [reducedMotion]);

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Accueil — Chams Adams, Maison de couture"
      className="relative isolate flex h-[100svh] min-h-[800px] items-center justify-center overflow-hidden bg-noir"
    >
      {/* Fond : vidéo (ou poster statique si reduced-motion ou vidéo manquante) */}
      {reducedMotion ? (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${POSTER}')` }}
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={POSTER}
          aria-hidden
          onLoadedData={() => setVideoLoaded(true)}
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      )}

      {/* Overlay sombre gradué — initialisé à 0.8 */}
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-noir/40 via-noir/20 to-noir/80"
        style={{ opacity: 0.8 }}
      />

      {/* Bouton mute/unmute — visible uniquement si la vidéo joue réellement */}
      {!reducedMotion && videoLoaded && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? 'Activer le son' : 'Couper le son'}
          aria-pressed={!muted}
          data-cursor="hover"
          className="absolute right-6 top-28 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-ivoire/20 bg-noir/30 text-ivoire/70 backdrop-blur-sm transition-all duration-300 hover:border-or hover:text-or"
        >
          {muted ? (
            <VolumeX className="h-[18px] w-[18px]" aria-hidden />
          ) : (
            <Volume2 className="h-[18px] w-[18px]" aria-hidden />
          )}
        </button>
      )}

      {/* Contenu éditorial */}
      <div
        ref={contentRef}
        className="container-content relative z-10 flex flex-col items-center gap-6 px-6 text-center sm:gap-8"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: reducedMotion ? 0 : 0.2 }}
          className="font-sans text-xs uppercase tracking-[0.3em] text-or"
        >
          Maison de couture
        </motion.span>

        <TextReveal
          as="h1"
          splitBy="chars"
          stagger={0.03}
          delay={0.5}
          duration={1.1}
          className="font-serif font-light text-display-xl text-balance leading-[1.05] text-ivoire"
        >
          Le kaftan comme héritage
        </TextReveal>

        <TextReveal
          as="p"
          splitBy="words"
          stagger={0.05}
          delay={1.5}
          duration={0.9}
          className={cn(
            'max-w-prose font-serif italic text-pretty text-ivoire/75',
            'text-2xl md:text-3xl lg:text-[32px] leading-relaxed'
          )}
        >
          De la terre sahélienne à vos plus grands jours
        </TextReveal>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reducedMotion ? 0 : 2.2,
            duration: 0.9,
            ease: [0.19, 1, 0.22, 1],
          }}
          className="mt-4"
        >
          <Link href="/collections" data-cursor="magnetic" className="btn-or">
            Entrer dans l&apos;univers
          </Link>
        </motion.div>
      </div>

      {/* Indicateur de scroll */}
      <div
        ref={hintRef}
        aria-hidden
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="relative block h-10 w-px overflow-hidden bg-ivoire/15">
          <motion.span
            className="absolute left-0 top-0 block h-3 w-px bg-or"
            initial={{ y: -12 }}
            animate={reducedMotion ? { y: 0 } : { y: 40 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    repeat: Infinity,
                    duration: 2.4,
                    ease: [0.65, 0, 0.35, 1],
                  }
            }
          />
        </span>
        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-ivoire/40">
          Descendre
        </span>
      </div>
    </section>
  );
}
