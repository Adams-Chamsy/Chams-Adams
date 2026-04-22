import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import { Marquee } from '@/components/ui/Marquee';
import { PRESS, sortPressByDate, type PressEntry } from '@/lib/data/press.mock';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Revue de presse',
  description:
    'La Maison Chams Adams dans la presse : Vogue Afrique, Nataal, Jeune Afrique, Le Monde, ELLE, Financial Times.',
  openGraph: {
    title: 'Revue de presse — Chams Adams',
    description: 'La Maison Chams Adams dans la presse internationale.',
  },
};

const DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function PressePage() {
  const sorted = sortPressByDate(PRESS);
  const featured = sorted.filter((p) => p.featured);
  const rest = sorted.filter((p) => !p.featured);

  return (
    <>
      {/* Header */}
      <section className="bg-noir pt-[140px] pb-[60px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Revue de presse' },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Ils ont écrit
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light text-balance leading-[1.05] text-ivoire text-[clamp(2.5rem,6vw,5rem)]"
          >
            Revue de presse
          </TextReveal>
          <p className="max-w-prose font-serif italic leading-relaxed text-ivoire/75 text-xl md:text-2xl">
            La Maison vue par la presse internationale&nbsp;— un regard
            extérieur, une mesure de la justesse.
          </p>
        </div>
      </section>

      {/* Featured — citations mises en avant */}
      {featured.length > 0 && (
        <section
          aria-label="Mises en avant"
          className="bg-noir pb-[80px] md:pb-[120px]"
        >
          <div className="container-content grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
            {featured.map((entry) => (
              <PressFeatureCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      )}

      {/* Marquee — mur de logos presse (éditorial) */}
      <section aria-label="Publications" className="bg-noir">
        <Marquee
          items={sorted.map((p) => p.logoText)}
          durationSec={60}
          pauseOnHover
        />
      </section>

      {/* Liste secondaire */}
      {rest.length > 0 && (
        <section
          aria-labelledby="press-all-title"
          className="bg-noir pb-[160px]"
        >
          <div className="container-content flex flex-col gap-12">
            <div className="flex items-baseline justify-between border-b border-bronze/25 pb-4">
              <h2
                id="press-all-title"
                className="font-serif text-2xl font-light text-ivoire md:text-3xl"
              >
                Toutes les parutions
              </h2>
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/50">
                {sorted.length} parutions
              </span>
            </div>
            <ul className="flex flex-col divide-y divide-bronze/15">
              {rest.map((entry) => (
                <PressRow key={entry.id} entry={entry} />
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Contact presse */}
      <section className="bg-noir pb-[120px]">
        <div className="container-content border-t border-bronze/25 pt-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
                Contact presse
              </span>
              <h2 className="mt-3 font-serif font-light leading-tight text-ivoire text-[clamp(1.75rem,3vw,2.5rem)]">
                Pour toute demande éditoriale
              </h2>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-7">
              <p className="max-w-prose font-serif italic leading-relaxed text-ivoire/75 text-lg">
                Interview, shooting, prêt de pièce, visite d&apos;atelier —
                notre équipe presse revient vers vous sous 48 heures ouvrées.
              </p>
              <ul className="flex flex-col gap-3 font-serif text-ivoire/85 text-lg">
                <li>
                  <a
                    href="mailto:presse@chams-adams.com"
                    data-cursor="hover"
                    className="text-or underline decoration-1 underline-offset-4 hover:text-ivoire"
                  >
                    presse@chams-adams.com
                  </a>
                </li>
                <li className="font-sans tracking-[0.1em] text-ivoire/70">
                  {'{{+33 … }}'}
                </li>
              </ul>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:gap-6">
                <Link
                  href="/contact"
                  data-cursor="magnetic"
                  className="btn-or"
                >
                  Nous écrire
                </Link>
                <a
                  href="#"
                  data-cursor="hover"
                  className="btn-ghost"
                  aria-label="Télécharger le dossier de presse (à venir)"
                >
                  Dossier de presse
                  <span aria-hidden>↓</span>
                </a>
              </div>
              <p className="font-sans text-xs italic text-ivoire/45">
                Dossier de presse (PDF) — bientôt disponible.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PressFeatureCard({ entry }: { entry: PressEntry }) {
  return (
    <article className="flex flex-col gap-6 border border-or/30 p-8 md:p-10">
      <header className="flex items-baseline justify-between gap-4 border-b border-bronze/20 pb-4">
        <span className="font-serif text-3xl font-light text-ivoire md:text-4xl">
          {entry.logoText}
        </span>
        <span className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/55">
          {DATE_FORMAT.format(new Date(entry.date))}
        </span>
      </header>
      <h3 className="font-serif text-xl font-light leading-snug text-ivoire md:text-2xl">
        {entry.title}
      </h3>
      <blockquote className="border-l-2 border-or/50 pl-5 font-serif italic leading-relaxed text-ivoire/75 text-lg">
        {entry.excerpt}
      </blockquote>
      <footer className="mt-auto flex items-center justify-between">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/55">
          {entry.publication}
        </span>
        {entry.articleUrl && (
          <a
            href={entry.articleUrl}
            target={entry.articleUrl.startsWith('http') ? '_blank' : undefined}
            rel={entry.articleUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
            data-cursor="hover"
            className="font-sans text-xs uppercase tracking-[0.25em] text-or underline-offset-4 hover:underline"
          >
            Lire l&apos;article
            <span aria-hidden className="ml-1">
              →
            </span>
          </a>
        )}
      </footer>
    </article>
  );
}

function PressRow({ entry }: { entry: PressEntry }) {
  return (
    <li className="grid grid-cols-1 items-baseline gap-4 py-8 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-3">
        <p className="font-serif text-2xl font-light text-ivoire md:text-3xl">
          {entry.logoText}
        </p>
        <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/55">
          {DATE_FORMAT.format(new Date(entry.date))}
        </p>
      </div>
      <div className="md:col-span-6">
        <h3 className="font-serif text-lg font-light leading-snug text-ivoire md:text-xl">
          {entry.title}
        </h3>
        <p className="mt-2 font-serif italic leading-relaxed text-ivoire/65">
          {entry.excerpt}
        </p>
      </div>
      <div
        className={cn(
          'flex flex-col items-start gap-2 md:col-span-3 md:items-end'
        )}
      >
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/55">
          {entry.publication}
        </span>
        {entry.articleUrl && (
          <a
            href={entry.articleUrl}
            target={entry.articleUrl.startsWith('http') ? '_blank' : undefined}
            rel={
              entry.articleUrl.startsWith('http') ? 'noopener noreferrer' : undefined
            }
            data-cursor="hover"
            className="font-sans text-xs uppercase tracking-[0.25em] text-or underline-offset-4 hover:underline"
          >
            Lire <span aria-hidden className="ml-1">→</span>
          </a>
        )}
      </div>
    </li>
  );
}
