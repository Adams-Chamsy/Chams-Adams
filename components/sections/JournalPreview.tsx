'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TextReveal } from '@/components/animations/TextReveal';
import { ParallaxLayer } from '@/components/animations/ParallaxLayer';
import { cn } from '@/lib/utils';

const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

type Article = {
  slug: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
};

const articles: Article[] = [
  {
    slug: 'fatou-diagne-or-au-bout-des-doigts',
    category: 'Portrait',
    date: 'Avril 2026',
    title: 'Fatou Diagne, l’or au bout des doigts',
    excerpt:
      "Dans son atelier de Dakar, maîtresse brodeuse depuis quarante ans, elle raconte comment chaque motif est une prière silencieuse.",
    image: '/images/journal/portrait-artisan.svg',
    imageAlt: "Portrait de Fatou Diagne, maîtresse brodeuse, en lumière chaude",
  },
  {
    slug: 'magal-de-touba-quand-le-kaftan-devient-ferveur',
    category: 'Héritage',
    date: 'Mars 2026',
    title: 'Le Magal de Touba, quand le kaftan devient ferveur',
    excerpt:
      "Chaque année, deux millions de fidèles convergent vers la ville sainte. Leur habit n'est pas un détail : il est déjà prière.",
    image: '/images/journal/magal-touba.svg',
    imageAlt: "Foule de fidèles en kaftans clairs au Magal de Touba",
  },
  {
    slug: 'bleu-qui-traverse-les-siecles',
    category: 'Inspiration',
    date: 'Février 2026',
    title: 'Le bleu qui traverse les siècles',
    excerpt:
      "De la pierre lapis-lazuli à l'indigo du Sahel, l'histoire millénaire d'une couleur qui dit la noblesse.",
    image: '/images/journal/indigo-detail.svg',
    imageAlt: "Macro d'un tissu indigo — trame serrée, reflets profonds",
  },
];

export function JournalPreview() {
  return (
    <section
      aria-labelledby="journal-title"
      className="relative isolate bg-noir py-[120px] md:py-[180px]"
    >
      <div className="container-content flex flex-col gap-16 md:gap-20">
        <header className="flex max-w-3xl flex-col gap-6">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Journal de la Maison
          </span>
          <TextReveal
            as="h2"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light leading-tight text-ivoire text-[clamp(2rem,4.5vw,4rem)]"
          >
            Nos correspondances
          </TextReveal>
          <p className="max-w-prose font-serif italic text-ivoire/70 text-xl md:text-2xl">
            Récits, inspirations, rencontres.
          </p>
        </header>

        {/* Grille asymétrique (desktop) / stack (mobile) */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
          {articles.map((a, i) => {
            const isMiddle = i === 1;
            const card = <ArticleCard article={a} index={i} />;
            return (
              <div
                key={a.slug}
                className={cn(isMiddle ? 'md:mt-20 lg:mt-28' : undefined)}
              >
                {isMiddle ? (
                  <ParallaxLayer speed={0.15}>{card}</ParallaxLayer>
                ) : (
                  card
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link href="/journal" data-cursor="magnetic" className="btn-or">
            Explorer le journal
          </Link>
        </div>

        <h2 id="journal-title" className="sr-only">
          Derniers articles du journal
        </h2>
      </div>
    </section>
  );
}

function ArticleCard({ article: a, index }: { article: Article; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: index * 0.12 }}
      className="group flex flex-col gap-5"
    >
      <Link
        href={`/journal/${a.slug}`}
        data-cursor="hover"
        aria-label={`${a.category} — ${a.title}`}
        className="block"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-noir-700">
          <Image
            src={a.image}
            alt={a.imageAlt}
            fill
            sizes="(max-width: 768px) 90vw, 30vw"
            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-noir/20 transition-opacity duration-500 group-hover:bg-noir/5"
          />
        </div>
      </Link>

      <div className="flex items-center justify-between gap-4">
        <span className="font-sans text-xs uppercase tracking-[0.25em] text-or">
          {a.category}
        </span>
        <time className="font-sans text-xs italic text-ivoire/50">
          {a.date}
        </time>
      </div>

      <h3 className="font-serif font-light text-ivoire text-2xl md:text-[28px] leading-tight">
        <Link
          href={`/journal/${a.slug}`}
          data-cursor="hover"
          className="transition-colors duration-300 hover:text-or"
        >
          {a.title}
        </Link>
      </h3>

      <p className="line-clamp-2 font-sans text-sm leading-relaxed text-ivoire/70">
        {a.excerpt}
      </p>

      <Link
        href={`/journal/${a.slug}`}
        data-cursor="hover"
        className="group/link inline-flex items-center gap-2 font-serif italic text-or transition-colors duration-300 hover:text-or/80"
      >
        Lire
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 group-hover/link:translate-x-1"
        >
          →
        </span>
      </Link>
    </motion.article>
  );
}
