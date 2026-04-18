'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { TextReveal } from '@/components/animations/TextReveal';
import { ZoomReveal } from '@/components/animations/ZoomReveal';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';
import { useReducedMotion } from '@/lib/animations/useReducedMotion';
import { cn } from '@/lib/utils';

const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

type Bloc = {
  num: string;
  eyebrow: string;
  title: string;
  paragraph: string;
  stat: { value: number; suffix: string; label: string };
  image: string;
  imageAlt: string;
  layout: 'image-left' | 'image-right';
};

const blocs: Bloc[] = [
  {
    num: '01',
    eyebrow: '01 — La broderie',
    title: 'Le fil qui raconte',
    paragraph:
      "Chaque motif est dessiné à la main avant d'être brodé. Nos artisans travaillent au fil de soie selon des techniques transmises de mère en fille depuis six générations. Une broderie complexe demande jusqu'à trois semaines de travail ininterrompu.",
    stat: {
      value: 280,
      suffix: 'h',
      label: 'de travail en moyenne par pièce brodée',
    },
    image: '/images/savoir-faire/broderie-macro.svg',
    imageAlt:
      'Macro d’une main qui brode au fil d’or sur un tissu sombre',
    layout: 'image-left',
  },
  {
    num: '02',
    eyebrow: '02 — La teinture',
    title: "L'indigo profond",
    paragraph:
      "Le bazin riche est teinté à la main dans trois bains successifs d'indigo naturel. Entre chaque bain, le tissu est battu au pilon pour révéler son éclat. Ce lustre si particulier qui ne s'obtient par aucun procédé industriel.",
    stat: { value: 3, suffix: ' bains', label: 'successifs — 48 h de séchage' },
    image: '/images/savoir-faire/teinture-indigo.svg',
    imageAlt:
      'Bassin de teinture indigo avec reflets profonds et mains plongées dans le tissu',
    layout: 'image-right',
  },
  {
    num: '03',
    eyebrow: '03 — La coupe',
    title: 'L’architecture intime',
    paragraph:
      "Chaque kaftan est coupé à la demande, à la mesure exacte de celle ou celui qui le portera. La coupe respecte l'amplitude traditionnelle tout en affinant la silhouette : une architecture qui honore le corps sans jamais le contraindre.",
    stat: { value: 28, suffix: ' points', label: 'de mesure pris au sur-mesure' },
    image: '/images/savoir-faire/coupe-craie.svg',
    imageAlt: 'Craie blanche traçant un patron de kaftan sur tissu noir',
    layout: 'image-left',
  },
];

export function SavoirFaireSection() {
  return (
    <section
      aria-labelledby="savoir-faire-title"
      className="relative isolate bg-noir py-[120px] md:py-[180px]"
    >
      <div className="container-content flex flex-col gap-16 md:gap-24">
        {/* Header */}
        <header className="flex max-w-3xl flex-col gap-6">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            L&apos;art et la main
          </span>
          <TextReveal
            as="h2"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light text-balance leading-[1.05] text-ivoire text-[clamp(2.25rem,5vw,4.5rem)]"
          >
            Derrière chaque pièce, une lignée
          </TextReveal>
          <p className="max-w-prose font-serif italic text-ivoire/70 text-xl md:text-2xl">
            Nos artisans perpétuent un savoir-faire transmis depuis des siècles.
          </p>
        </header>

        {/* 3 blocs alternés */}
        <div className="flex flex-col">
          {blocs.map((bloc, i) => (
            <div key={bloc.num}>
              <BlocEditorial bloc={bloc} />
              {i < blocs.length - 1 && (
                <div
                  aria-hidden
                  className="my-16 h-px w-full bg-bronze/20 md:my-24"
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-8 flex flex-col items-center gap-6 py-12 text-center md:mt-16 md:py-20">
          <p className="font-serif italic text-ivoire/75 text-2xl md:text-3xl">
            Découvrir tout l&apos;atelier
          </p>
          <Link href="/savoir-faire" data-cursor="magnetic" className="btn-or">
            Entrer dans l&apos;atelier
          </Link>
        </div>

        <h2 id="savoir-faire-title" className="sr-only">
          Le savoir-faire Chams Adams
        </h2>
      </div>
    </section>
  );
}

function BlocEditorial({ bloc }: { bloc: Bloc }) {
  const imageLeft = bloc.layout === 'image-left';

  return (
    <article
      aria-labelledby={`bloc-${bloc.num}-title`}
      className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16"
    >
      {/* Numéro géant en filigrane — couleur warm gray #666056 (3.2:1 sur noir,
          conforme WCAG AA large text). Plus visible que le 0.06 d'opacité
          initial, mais reste une strate éditoriale subtile derrière le contenu. */}
      <span
        aria-hidden
        role="presentation"
        className={cn(
          'pointer-events-none absolute top-[-40px] select-none font-serif font-light leading-none text-[#666056]',
          'text-[100px] md:text-[140px] lg:text-[180px]',
          imageLeft ? 'right-0 lg:right-4' : 'left-0 lg:left-4'
        )}
      >
        {bloc.num}
      </span>

      {/* Image avec ZoomReveal subtil */}
      <div
        className={cn(
          'relative lg:col-span-7',
          imageLeft ? 'lg:order-1' : 'lg:order-2 lg:col-start-6'
        )}
      >
        <ZoomReveal scale={[1, 1.15]} className="relative aspect-[4/5] w-full">
          <Image
            src={bloc.image}
            alt={bloc.imageAlt}
            fill
            sizes="(max-width: 1024px) 90vw, 58vw"
            className="object-cover"
          />
        </ZoomReveal>
      </div>

      {/* Texte */}
      <div
        className={cn(
          'flex flex-col gap-6 lg:col-span-5',
          imageLeft ? 'lg:order-2' : 'lg:order-1'
        )}
      >
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6 }}
          className="font-sans text-xs uppercase tracking-[0.3em] text-or"
        >
          {bloc.eyebrow}
        </motion.span>

        <TextReveal
          as="h3"
          splitBy="words"
          stagger={0.05}
          duration={0.8}
          className="font-serif font-light leading-tight text-ivoire text-[clamp(1.75rem,3vw,3rem)]"
        >
          {bloc.title}
        </TextReveal>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.2 }}
          className="max-w-prose text-body-lg leading-[1.75] text-ivoire/75"
        >
          {bloc.paragraph}
        </motion.p>

        {/* Stat chiffré animé */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.4 }}
          className="mt-4 flex items-baseline gap-4 border-t border-bronze/20 pt-6"
        >
          <AnimatedCounter
            value={bloc.stat.value}
            suffix={bloc.stat.suffix}
            className="font-serif font-light leading-none text-ivoire/90 text-[clamp(2.5rem,4vw,3.5rem)]"
          />
          <span className="font-sans text-sm leading-tight text-ivoire/60">
            {bloc.stat.label}
          </span>
        </motion.div>

        {/* Titre caché pour sémantique */}
        <h3 id={`bloc-${bloc.num}-title`} className="sr-only">
          {bloc.title}
        </h3>
      </div>
    </article>
  );
}

/**
 * Compteur qui anime de 0 → `value` avec easing quartique, déclenché par
 * IntersectionObserver. Accessible : `aria-label` porte la valeur finale
 * dès le premier rendu.
 */
function AnimatedCounter({
  value,
  suffix = '',
  duration = 1500,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useIntersectionObserver(ref, { threshold: 0.4 });
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reducedMotion]);

  return (
    <span ref={ref} className={className}>
      {/* Accessible name via sr-only — pas de aria-label sur span (prohibé) */}
      <span className="sr-only">{`${value}${suffix}`}</span>
      <span aria-hidden>{display}</span>
      <span
        aria-hidden
        className="ml-1 font-sans text-xl uppercase tracking-[0.15em] text-or/80"
      >
        {suffix}
      </span>
    </span>
  );
}
