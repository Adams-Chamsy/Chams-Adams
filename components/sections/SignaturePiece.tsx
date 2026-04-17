'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TextReveal } from '@/components/animations/TextReveal';
import { Product360 } from '@/components/animations/Product360';

const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

const details = [
  { label: 'Matière', value: 'Bazin riche' },
  { label: 'Teinture', value: 'Indigo naturel' },
  { label: 'Broderie', value: 'Fil de soie dorée, main' },
  { label: 'Temps de création', value: '3 semaines' },
];

export function SignaturePiece() {
  return (
    <section
      aria-labelledby="signature-title"
      className="relative isolate overflow-hidden bg-noir py-[120px] md:py-[160px]"
    >
      {/* Dégradé subtil noir → touche indigo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 70% 40%, rgba(27, 41, 81, 0.22) 0%, rgba(10, 10, 10, 0) 55%)',
        }}
      />

      <div className="container-content relative">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Colonne texte */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.6 }}
              className="font-sans text-xs uppercase tracking-[0.3em] text-or"
            >
              Pièce signature
            </motion.span>

            <TextReveal
              as="h2"
              splitBy="chars"
              stagger={0.04}
              duration={1}
              className="font-serif font-light text-ivoire leading-none text-[clamp(3rem,6vw,5rem)]"
            >
              L&apos;Aïcha
            </TextReveal>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.2 }}
              className="font-serif italic text-ivoire/70 text-xl md:text-2xl"
            >
              Kaftan de cérémonie en bazin riche teinté indigo.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 }}
              className="max-w-prose text-body-lg leading-[1.7] text-ivoire/80"
            >
              Trois semaines de broderie au fil de soie dorée. Deux cent
              quatre-vingts heures de travail. Un bazin riche battu à la main,
              teinté en trois bains d&apos;indigo puis lustré à la pierre jusqu&apos;à
              l&apos;éclat final. L&apos;Aïcha n&apos;est pas une robe. C&apos;est une architecture
              portée, une cathédrale intime.
            </motion.p>

            <motion.dl
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-10%' }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } },
              }}
              className="mt-2 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-bronze/20 pt-6"
            >
              {details.map((d) => (
                <motion.div
                  key={d.label}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                  className="flex flex-col gap-1.5"
                >
                  <dt className="font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                    {d.label}
                  </dt>
                  <dd className="font-serif text-ivoire text-lg md:text-xl">
                    {d.value}
                  </dd>
                </motion.div>
              ))}
            </motion.dl>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8"
            >
              <Link href="/boutique/aicha" data-cursor="magnetic" className="btn-or">
                Découvrir la pièce
              </Link>
              <Link href="/sur-mesure" data-cursor="hover" className="btn-ghost">
                Demander le sur-mesure
                <span aria-hidden>→</span>
              </Link>
            </motion.div>
          </div>

          {/* Colonne Product360 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
            className="relative lg:col-span-7"
          >
            {/* Halo doré en arrière */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  'radial-gradient(circle at 50% 45%, rgba(201, 169, 97, 0.14) 0%, rgba(10, 10, 10, 0) 55%)',
              }}
            />
            <Product360
              placeholderSrc="/images/signature/aicha-signature.svg"
              alt="L'Aïcha — kaftan de cérémonie signature Chams Adams, bazin riche indigo avec broderie or main"
              rotations={1}
              className="mx-auto h-[60vh] w-full max-w-[560px] lg:h-[70vh]"
            />
            {/* Socle éditorial */}
            <div
              aria-hidden
              className="mx-auto mt-4 h-px w-2/3 bg-gradient-to-r from-transparent via-or/30 to-transparent"
            />
          </motion.div>
        </div>

        <h2 id="signature-title" className="sr-only">
          L&apos;Aïcha — pièce signature de la maison Chams Adams
        </h2>
      </div>
    </section>
  );
}
