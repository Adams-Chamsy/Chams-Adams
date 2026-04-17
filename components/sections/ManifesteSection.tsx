'use client';

import { motion } from 'framer-motion';
import { TextReveal } from '@/components/animations/TextReveal';
import { ParallaxLayer } from '@/components/animations/ParallaxLayer';

// SVG noise discret en data-URL (1 requête de moins) — grain éditorial à 0.02 d'opacité.
const GRAIN_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 0.89  0 0 0 0 0.56  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

export function ManifesteSection() {
  return (
    <section
      aria-labelledby="manifeste-title"
      className="relative isolate overflow-hidden bg-noir py-[120px] md:py-[200px]"
    >
      {/* Grain éditorial très discret */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{ backgroundImage: GRAIN_BG }}
      />

      <div className="container-content relative">
        <div className="grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-12">
          {/* Colonne 1 — Mot manuscrit en Italianno */}
          <div className="md:col-span-4 md:col-start-2">
            <ParallaxLayer speed={0.3} className="overflow-visible">
              <TextReveal
                as="p"
                splitBy="chars"
                stagger={0.08}
                duration={1.1}
                className="font-script leading-[0.85] text-or text-[80px] md:text-[100px] lg:text-[120px]"
              >
                Héritage
              </TextReveal>
            </ParallaxLayer>
          </div>

          {/* Colonne 2 — Le manifeste */}
          <div className="flex flex-col gap-8 md:col-span-6 md:col-start-6">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.6 }}
              className="font-sans text-eyebrow uppercase text-or/80"
            >
              Notre vision
            </motion.span>

            <TextReveal
              as="h2"
              splitBy="words"
              stagger={0.07}
              duration={0.9}
              className="font-serif font-light text-balance leading-tight text-ivoire text-[clamp(2rem,4.5vw,3.5rem)]"
            >
              Chaque fil raconte un matin.
            </TextReveal>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
              className="font-serif italic text-pretty leading-[1.6] text-ivoire/85 text-[clamp(1.125rem,2vw,1.5rem)]"
            >
              Chez Chams Adams, le kaftan n&apos;est pas un vêtement. Il est
              mémoire vivante, tissée main par main, portée de génération en
              génération.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.2 }}
              className="max-w-md font-sans text-body-lg leading-relaxed text-ivoire/70"
            >
              Nos artisans perpétuent un savoir-faire transmis depuis des
              siècles le long des rives du Sénégal. Chaque pièce est le fruit
              de semaines de travail, de broderies au fil de soie, de teintures
              au bazin selon les méthodes anciennes.
            </motion.p>

            <motion.p
              id="manifeste-title"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="mt-4 font-script text-3xl text-or md:text-4xl"
            >
              — Chams Adams, Maison de couture
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
