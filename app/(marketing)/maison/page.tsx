import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import { ZoomReveal } from '@/components/animations/ZoomReveal';

export const metadata: Metadata = {
  title: 'La Maison',
  description:
    "Chams Adams — l'histoire, l'atelier, la lignée. Une maison de couture née d'un héritage ouest-africain, portée par la main.",
  openGraph: {
    title: 'La Maison — Chams Adams',
    description:
      "L'histoire, l'atelier, la lignée d'une maison de couture née d'un héritage ouest-africain.",
  },
};

export default function MaisonPage() {
  return (
    <>
      {/* HERO — grande typographie, pas d'image de fond */}
      <section className="bg-noir pt-[140px] pb-[80px] md:pt-[180px] md:pb-[120px]">
        <div className="container-content flex flex-col gap-8">
          <Breadcrumbs
            items={[{ label: 'Accueil', href: '/' }, { label: 'La Maison' }]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Chams Adams, maison de couture
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.07}
            duration={1}
            className="max-w-[14ch] font-serif font-light leading-[1.02] text-ivoire text-[clamp(3rem,8vw,7rem)]"
          >
            La Maison
          </TextReveal>
          <p className="max-w-prose font-serif italic leading-relaxed text-ivoire/80 text-xl md:text-2xl">
            Une ligne, un geste, une lignée. De la terre sahélienne à vos plus
            grands jours, nous perpétuons un héritage — celui du grand boubou
            ouest-africain.
          </p>
        </div>
      </section>

      {/* MANIFESTE */}
      <section
        aria-labelledby="maison-manifeste"
        className="bg-noir py-[80px] md:py-[120px]"
      >
        <div className="container-content grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <header className="lg:col-span-4">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
              Manifeste
            </span>
            <h2
              id="maison-manifeste"
              className="mt-3 font-serif font-light leading-tight text-ivoire text-[clamp(1.75rem,3vw,2.75rem)]"
            >
              Le kaftan comme héritage
            </h2>
          </header>
          <div className="flex flex-col gap-6 font-serif italic leading-[1.7] text-ivoire/80 text-xl md:text-2xl lg:col-span-7">
            <p>
              Nous ne faisons pas de vêtements. Nous taillons des héritages.
              Chaque pièce porte la trace d&apos;une main, d&apos;une histoire,
              d&apos;une transmission.
            </p>
            <p className="font-sans not-italic text-body-lg text-ivoire/70">
              Chams Adams honore le grand boubou ouest-africain tel qu&apos;il
              a toujours été pensé&nbsp;: architecture vivante, noblesse
              portée, témoignage des plus grands jours. Nous puisons dans cette
              lignée pour composer un vestiaire contemporain — sobre, clair,
              habité.
            </p>
          </div>
        </div>
      </section>

      {/* L'HISTOIRE */}
      <section
        aria-labelledby="maison-histoire"
        className="relative isolate bg-noir py-[120px]"
      >
        <div className="container-content grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <ZoomReveal
            scale={[1, 1.15]}
            className="relative aspect-[4/5] w-full overflow-hidden lg:col-span-5"
          >
            <Image
              src="/images/savoir-faire/teinture-indigo.svg"
              alt="Atelier Chams Adams — bain d'indigo naturel"
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
          </ZoomReveal>
          <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
              Notre histoire
            </span>
            <h2
              id="maison-histoire"
              className="font-serif font-light leading-tight text-ivoire text-[clamp(1.75rem,3vw,2.75rem)]"
            >
              Six générations de main
            </h2>
            <p className="max-w-prose font-serif italic text-ivoire/75 text-lg leading-relaxed">
              La maison Chams Adams plonge ses racines dans un atelier
              sahélien transmis de mère en fille depuis six générations.
              {' '}{'{{Texte à compléter — fondation, fondateur·trice, année}}'}.
            </p>
            <p className="max-w-prose font-sans text-body-lg leading-[1.75] text-ivoire/75">
              Nous avons choisi de confier notre savoir-faire à une nouvelle
              grammaire, sans rien perdre de son âme. Nos pièces voyagent
              aujourd&apos;hui de Dakar à Paris, d&apos;Abidjan à New York —
              portées par celles et ceux qui savent que l&apos;élégance est
              d&apos;abord un héritage.
            </p>
          </div>
        </div>
      </section>

      {/* L'ATELIER */}
      <section
        aria-labelledby="maison-atelier"
        className="bg-noir py-[120px]"
      >
        <div className="container-content grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
              L&apos;atelier
            </span>
            <h2
              id="maison-atelier"
              className="font-serif font-light leading-tight text-ivoire text-[clamp(1.75rem,3vw,2.75rem)]"
            >
              L&apos;exigence de la main
            </h2>
            <p className="max-w-prose font-serif italic text-ivoire/75 text-lg leading-relaxed">
              Dans notre atelier, rien ne se fait à la machine qui puisse se
              faire à la main. Coupe sur mesure, broderie main au fil de soie,
              teintures en trois bains d&apos;indigo naturel.
            </p>
            <p className="max-w-prose font-sans text-body-lg leading-[1.75] text-ivoire/75">
              Chaque pièce passe par les mains d&apos;au moins quatre
              artisans — la coupe, la broderie, la finition, le contrôle. Une
              broderie complexe demande jusqu&apos;à trois semaines de travail
              ininterrompu.
            </p>
            <div className="mt-4">
              <Link
                href="/savoir-faire"
                data-cursor="magnetic"
                className="btn-or"
              >
                Entrer dans l&apos;atelier
              </Link>
            </div>
          </div>
          <ZoomReveal
            scale={[1, 1.15]}
            className="relative aspect-[4/5] w-full overflow-hidden lg:col-span-5 lg:col-start-8"
          >
            <Image
              src="/images/savoir-faire/broderie-macro.svg"
              alt="Macro d'une main qui brode au fil d'or sur tissu sombre"
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
          </ZoomReveal>
        </div>
      </section>

      {/* LA LIGNÉE — citation / signature */}
      <section
        aria-labelledby="maison-lignee"
        className="relative isolate bg-noir py-[140px] md:py-[180px]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, rgba(201, 169, 97, 0.08) 0%, rgba(10, 10, 10, 0) 60%)',
          }}
        />
        <div className="container-content relative flex flex-col items-center gap-10 text-center">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            La lignée
          </span>
          <h2
            id="maison-lignee"
            className="max-w-[18ch] font-serif font-light leading-[1.1] text-ivoire text-[clamp(2rem,5vw,4rem)]"
          >
            Ce qui se transmet ne s&apos;imite pas.
          </h2>
          <p className="max-w-prose font-serif italic leading-relaxed text-ivoire/70 text-xl md:text-2xl">
            Nous ne créons pas pour les saisons — nous créons pour les
            générations. Chaque pièce est conçue pour être portée, reprise,
            transmise. Une écriture longue dans un monde qui célèbre
            l&apos;éphémère.
          </p>
          <div
            aria-hidden
            className="my-4 h-px w-24 bg-gradient-to-r from-transparent via-or to-transparent"
          />
          <p className="font-script text-4xl text-or md:text-5xl">
            Chams Adams
          </p>
        </div>
      </section>

      {/* CTA DOUBLE */}
      <section className="bg-noir py-[80px]">
        <div className="container-content flex flex-col items-center gap-6 text-center md:flex-row md:justify-center md:gap-10">
          <Link href="/collections" data-cursor="magnetic" className="btn-or">
            Découvrir les collections
          </Link>
          <Link href="/contact" data-cursor="hover" className="btn-ghost">
            Nous rencontrer
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
