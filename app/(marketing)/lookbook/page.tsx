import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { TextReveal } from '@/components/animations/TextReveal';
import { ZoomReveal } from '@/components/animations/ZoomReveal';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Lookbook',
  description:
    "Séries photographiques de la maison Chams Adams. Une ode à la lumière, une célébration des femmes et des hommes qui portent le kaftan.",
  openGraph: {
    title: 'Lookbook — Chams Adams',
    description: "Séries photographiques de la maison.",
  },
};

// Un layout "bento magazine" : chaque photo définit son span et son aspect.
type LookItem = {
  src: string;
  alt: string;
  caption?: string;
  span?: string; // tailwind col-span classes
  aspect?: string; // tailwind aspect classes
};

const PRINTEMPS_2026: LookItem[] = [
  {
    src: '/images/products/kaftan-indigo.svg',
    alt: 'Kaftan indigo, regard frontal',
    caption: 'Indigo, silence.',
    span: 'md:col-span-8',
    aspect: 'aspect-[16/10]',
  },
  {
    src: '/images/products/kaftan-or.svg',
    alt: 'Kaftan or sahélien, profil',
    caption: 'Or, heure dorée.',
    span: 'md:col-span-4',
    aspect: 'aspect-[3/4]',
  },
  {
    src: '/images/products/kaftan-ivoire.svg',
    alt: 'Kaftan ivoire, mouvement',
    caption: 'Ivoire, respiration.',
    span: 'md:col-span-6',
    aspect: 'aspect-[4/5]',
  },
  {
    src: '/images/collections/ceremonies.svg',
    alt: 'Scène de cérémonie',
    caption: 'Cérémonie, Sine-Saloum.',
    span: 'md:col-span-6',
    aspect: 'aspect-[4/5]',
  },
  {
    src: '/images/products/kaftan-bordeaux.svg',
    alt: 'Kaftan bordeaux, détail',
    caption: 'Bordeaux, noblesse.',
    span: 'md:col-span-4',
    aspect: 'aspect-[3/4]',
  },
  {
    src: '/images/products/kaftan-noir.svg',
    alt: 'Kaftan noir, grande taille',
    caption: 'Noir velours, contre-jour.',
    span: 'md:col-span-8',
    aspect: 'aspect-[16/10]',
  },
  {
    src: '/images/products/kaftan-bronze.svg',
    alt: 'Kaftan bronze',
    caption: 'Bronze, crépuscule.',
    span: 'md:col-span-12',
    aspect: 'aspect-[21/9]',
  },
  {
    src: '/images/journal/magal-touba.svg',
    alt: 'Foule en kaftans clairs au Magal',
    caption: 'Magal, foule en blanc.',
    span: 'md:col-span-7',
    aspect: 'aspect-[4/5]',
  },
  {
    src: '/images/signature/aicha-signature.svg',
    alt: 'L’Aïcha, signature',
    caption: 'L’Aïcha, lumière.',
    span: 'md:col-span-5',
    aspect: 'aspect-[3/4]',
  },
];

const SERIES = [
  {
    season: 'Printemps 2026',
    title: 'Les Saintes',
    description:
      "Collection inspirée des lumières du Sine-Saloum, de l'heure dorée sur les tannes, du silence des baobabs. Une ode à la lumière, une célébration des femmes.",
    credits:
      'Photographie : Aïssa Diatta · Stylisme : Maison Chams Adams · Mannequin : Mariama S. · Lieu : Sine-Saloum, Sénégal',
    quote:
      'La lumière qui traverse un kaftan raconte plus que tous les mots.',
    images: PRINTEMPS_2026,
    collectionHref: '/collections/ceremonies',
  },
];

export default function LookbookPage() {
  const currentSeries = SERIES[0]!;

  return (
    <>
      {/* HERO */}
      <section className="bg-noir pt-[140px] pb-[80px] md:pt-[180px] md:pb-[120px]">
        <div className="container-content flex flex-col items-center gap-6 text-center">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Séries photographiques
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            className="font-serif font-light leading-[0.95] text-ivoire text-[clamp(4rem,12vw,9rem)]"
          >
            Lookbook
          </TextReveal>
          <p className="max-w-prose font-serif italic text-ivoire/70 text-xl md:text-2xl">
            Séries photographiques de la maison
          </p>
        </div>
      </section>

      {/* INTRO SÉRIE — eyebrow saison + titre + description */}
      <section className="bg-noir pb-[80px]">
        <div className="container-content border-t border-bronze/15 pt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-3 lg:col-span-5">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-or">
              Série · {currentSeries.season}
            </span>
            <h2 className="font-serif font-light leading-tight text-ivoire text-[clamp(2.5rem,5vw,4rem)]">
              {currentSeries.title}
            </h2>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
            <p className="font-serif italic text-ivoire/85 text-xl md:text-2xl leading-[1.5]">
              {currentSeries.description}
            </p>
            <p className="font-sans text-xs italic tracking-wide text-ivoire/50 leading-relaxed">
              {currentSeries.credits}
            </p>
          </div>
        </div>
      </section>

      {/* GRILLE ÉDITORIALE */}
      <section className="bg-noir pb-[80px]">
        <div className="container-wide">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-6 lg:gap-8">
            {currentSeries.images.map((img, i) => {
              const asFigure = i !== 4; // Insertion de la citation après la 4e image
              return (
                <div
                  key={i}
                  className={cn('col-span-2', img.span)}
                >
                  <ZoomReveal
                    scale={[1, 1.1]}
                    className={cn(
                      'relative w-full overflow-hidden bg-noir-800',
                      img.aspect ?? 'aspect-[4/5]'
                    )}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes={i === 6 ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
                        className="object-cover"
                        priority={i < 2}
                      />
                    </div>
                  </ZoomReveal>
                  {img.caption && (
                    <p className="mt-2 font-sans text-[11px] italic text-ivoire/50">
                      {img.caption}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CITATION FLOTTANTE */}
      <section className="bg-noir py-[120px]">
        <div className="container-content">
          <blockquote className="mx-auto max-w-3xl text-center font-serif italic text-ivoire text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.4]">
            « {currentSeries.quote} »
          </blockquote>
        </div>
      </section>

      {/* FIN DE SÉRIE */}
      <section className="bg-noir pb-[160px]">
        <div className="container-content flex flex-col items-center gap-6 border-t border-bronze/15 pt-16 text-center">
          <p className="font-serif italic text-ivoire/75 text-xl">
            Les pièces de cette série sont à retrouver dans la collection
            <span className="text-ivoire"> Cérémonies</span>.
          </p>
          <Link
            href={currentSeries.collectionHref}
            data-cursor="magnetic"
            className="btn-or"
          >
            Découvrir les pièces
          </Link>
        </div>
      </section>
    </>
  );
}
