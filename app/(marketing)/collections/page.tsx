import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { COLLECTIONS } from '@/lib/data/collections.mock';
import { TextReveal } from '@/components/animations/TextReveal';
import { ZoomReveal } from '@/components/animations/ZoomReveal';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Nos Univers',
  description:
    'Quatre mondes, une seule grâce — explorez les univers Chams Adams : Cérémonies, Tabaski & Magal, Prêt-à-porter, Sur-mesure.',
  openGraph: {
    title: 'Nos Univers — Chams Adams',
    description: "Quatre mondes, une seule grâce.",
  },
};

/**
 * Layout bento éditorial — 4 collections, tailles alternées.
 * Desktop : col-span 7/5 puis 5/7 pour casser la grille classique.
 * Mobile : stack vertical.
 */
const BENTO_CLASSES = [
  'lg:col-span-7 lg:row-span-2 aspect-[4/5] lg:aspect-[4/5]', // 1
  'lg:col-span-5 lg:row-span-1 aspect-[4/5] lg:aspect-[4/3]', // 2
  'lg:col-span-5 lg:row-span-1 aspect-[4/5] lg:aspect-[4/3]', // 3
  'lg:col-span-7 lg:row-span-2 aspect-[4/5] lg:aspect-[4/5]', // 4
];

export default function CollectionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center bg-noir pt-[140px] pb-[80px] md:pt-[180px]">
        <div className="container-content flex flex-col items-center gap-6 text-center">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Collections' },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Collections
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light text-balance leading-[1.05] text-ivoire text-[clamp(3rem,7vw,6rem)]"
          >
            Nos Univers
          </TextReveal>
          <p className="max-w-prose font-serif italic text-ivoire/70 text-xl md:text-2xl">
            Quatre mondes, une seule grâce.
          </p>
        </div>
      </section>

      {/* Bento grid */}
      <section
        aria-labelledby="collections-grid-title"
        className="bg-noir pb-[160px]"
      >
        <div className="container-content">
          <h2 id="collections-grid-title" className="sr-only">
            Les quatre collections
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:gap-8">
            {COLLECTIONS.map((col, i) => (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                data-cursor="hover"
                className={cn(
                  'group relative block overflow-hidden bg-noir-800 transition-transform duration-700 ease-out-expo hover:-translate-y-1',
                  BENTO_CLASSES[i]
                )}
              >
                <ZoomReveal scale={[1, 1.15]} className="absolute inset-0">
                  <Image
                    src={col.heroImage.url}
                    alt={col.heroImage.alt}
                    fill
                    priority={i < 2}
                    sizes="(max-width: 1024px) 95vw, (max-width: 1440px) 50vw, 700px"
                    className="object-cover"
                  />
                </ZoomReveal>

                {/* Voile graduel (visible) + hover qui s'assombrit */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/20 to-transparent transition-opacity duration-500 group-hover:from-noir/60"
                />

                {/* Contenu */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-10 lg:p-12">
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-or/90">
                    Collection {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-serif font-light text-ivoire leading-tight text-[clamp(2rem,3.5vw,3.5rem)]">
                    {col.name}
                  </h3>
                  <p className="max-w-md font-serif italic text-ivoire/80 text-base md:text-lg">
                    {col.tagline}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-or transition-transform duration-500 group-hover:translate-x-1">
                    Explorer
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
