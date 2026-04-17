'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  HorizontalScroll,
  HorizontalScrollProgress,
} from '@/components/animations/HorizontalScroll';
import { TextReveal } from '@/components/animations/TextReveal';
import { cn } from '@/lib/utils';

type Collection = {
  num: string;
  slug: string;
  title: string;
  description: string;
  cta: string;
  image: string;
  imageAlt: string;
  href: string;
};

const collections: Collection[] = [
  {
    num: '01',
    slug: 'ceremonies',
    title: 'Cérémonies',
    description:
      "Le kaftan des plus grands jours. Broderies main, soies précieuses, coupes architecturales.",
    cta: 'Découvrir',
    image: '/images/collections/ceremonies.svg',
    imageAlt: 'Silhouette de kaftan de cérémonie en or sahélien',
    href: '/collections/ceremonies',
  },
  {
    num: '02',
    slug: 'tabaski-magal',
    title: 'Tabaski & Magal',
    description:
      "Pour les fêtes qui rassemblent. L'élégance qui traverse les générations, de la prière au festin.",
    cta: 'Découvrir',
    image: '/images/collections/tabaski-magal.svg',
    imageAlt: 'Silhouette de kaftan pour Tabaski et Magal, indigo profond',
    href: '/collections/tabaski-magal',
  },
  {
    num: '03',
    slug: 'pret-a-porter',
    title: 'Prêt-à-porter luxe',
    description:
      "Le kaftan au quotidien. Pièces plus légères, gestes fluides, la majesté sans l'apparat.",
    cta: 'Découvrir',
    image: '/images/collections/pret-a-porter.svg',
    imageAlt: 'Silhouette de kaftan prêt-à-porter en ivoire',
    href: '/collections/pret-a-porter',
  },
  {
    num: '04',
    slug: 'sur-mesure',
    title: 'Sur-mesure',
    description:
      'Votre vision, notre savoir-faire. Une pièce unique, composée avec vous, pour vous.',
    cta: 'Composer votre pièce',
    image: '/images/collections/sur-mesure.svg',
    imageAlt: 'Silhouette de kaftan sur-mesure, coupe architecturale',
    href: '/sur-mesure',
  },
];

export function CollectionsShowcase() {
  return (
    <section aria-labelledby="collections-title" className="relative bg-noir">
      {/* Header (hors pin) */}
      <div className="container-content flex flex-col gap-6 py-[80px] md:py-[120px]">
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
          L&apos;univers Chams Adams
        </span>
        <TextReveal
          as="h2"
          splitBy="words"
          stagger={0.06}
          duration={0.9}
          className="font-serif font-light text-balance leading-tight text-ivoire text-[clamp(2.25rem,5vw,4.5rem)]"
        >
          Quatre mondes, une seule grâce
        </TextReveal>
        <p className="max-w-prose font-serif italic text-ivoire/70 text-xl md:text-2xl">
          Chaque collection est un chapitre de notre histoire.
        </p>
      </div>

      {/* Zone pinnée — scroll horizontal desktop, stack vertical mobile */}
      <HorizontalScroll>
        {collections.map((c, i) => (
          <CollectionSlide key={c.slug} collection={c} index={i} />
        ))}
        <HorizontalScrollProgress
          labels={collections.map((c) => c.num)}
        />
      </HorizontalScroll>

      {/* Titre sémantique pour le lecteur d'écran */}
      <h2 id="collections-title" className="sr-only">
        Nos quatre collections
      </h2>
    </section>
  );
}

function CollectionSlide({
  collection: c,
  index,
}: {
  collection: Collection;
  index: number;
}) {
  const imageFirst = index % 2 === 0;

  return (
    <article
      aria-labelledby={`slide-${c.slug}-title`}
      className={cn(
        'relative flex w-full flex-shrink-0 items-center justify-center overflow-hidden',
        'min-h-[80vh] py-[80px] lg:min-h-0 lg:h-screen lg:w-screen lg:py-0',
        'px-6 md:px-12 lg:px-20'
      )}
    >
      {/* Numéro géant en filigrane */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-6 top-10 select-none font-serif font-light leading-none text-ivoire/[0.06] text-[120px] md:left-12 md:text-[180px] lg:left-16 lg:top-16 lg:text-[220px]"
      >
        {c.num}
      </span>

      <div
        className={cn(
          'relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-10 lg:gap-16',
          'grid-cols-1 lg:grid-cols-12'
        )}
      >
        {/* Image */}
        <div
          className={cn(
            'relative overflow-hidden lg:col-span-5',
            imageFirst ? 'lg:order-1' : 'lg:order-2 lg:col-start-8'
          )}
        >
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={c.image}
              alt={c.imageAlt}
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        </div>

        {/* Texte */}
        <div
          className={cn(
            'flex flex-col gap-6 lg:col-span-5',
            imageFirst ? 'lg:order-2 lg:col-start-7' : 'lg:order-1 lg:col-start-2'
          )}
        >
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-or/80">
            Collection {c.num}
          </span>
          <h3
            id={`slide-${c.slug}-title`}
            className="font-serif font-light text-ivoire text-[clamp(2.5rem,5vw,5rem)] leading-[1.05]"
          >
            {c.title}
          </h3>
          <p className="max-w-prose text-body-lg leading-relaxed text-ivoire/75">
            {c.description}
          </p>
          <div>
            <Link href={c.href} data-cursor="hover" className="btn-or">
              {c.cta}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
