import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { PressEntryRow } from '@/lib/supabase/types';
import { PrintButton } from './PrintButton';

export const metadata: Metadata = {
  title: 'Dossier de presse',
  description:
    'Le dossier de presse Chams Adams — identité, manifeste, contacts et revue de presse.',
};

async function getPressEntries(): Promise<PressEntryRow[]> {
  try {
    const supabase = createSupabaseServiceClient();
    const { data } = await supabase
      .from('press_entries')
      .select('*')
      .order('published_at', { ascending: false });
    return (data ?? []) as PressEntryRow[];
  } catch {
    return [];
  }
}

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export default async function DossierDePressePage() {
  const press = await getPressEntries();

  return (
    <>
      {/* ÉCRAN — chrome navigation */}
      <section className="bg-noir pt-[140px] pb-[40px] md:pt-[180px] print:hidden">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Presse', href: '/presse' },
              { label: 'Dossier de presse' },
            ]}
          />
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
                Maison de couture
              </span>
              <TextReveal
                as="h1"
                splitBy="words"
                stagger={0.06}
                duration={0.9}
                className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.5rem,5.5vw,4.5rem)]"
              >
                Dossier de presse
              </TextReveal>
            </div>
            <PrintButton />
          </div>
          <p className="max-w-prose font-serif italic text-ivoire/70 text-lg">
            Téléchargez le dossier complet en PDF (impression silencieuse — sans
            bordures, format A4).
          </p>
        </div>
      </section>

      {/* CONTENU — visible écran ET impression */}
      <article className="bg-noir pb-[120px] print:bg-white print:pb-0 print:text-noir">
        <div className="container-content flex flex-col gap-12 print:gap-8 print:px-0">
          {/* Identité */}
          <section className="flex flex-col gap-3">
            <h2 className="font-serif text-3xl font-light text-ivoire print:text-noir">
              Chams Adams
            </h2>
            <p className="font-serif italic text-or print:text-bronze">
              Maison de couture · Kaftan subsaharien de luxe
            </p>
          </section>

          {/* Manifeste */}
          <section className="flex flex-col gap-4">
            <h3 className="font-sans text-[11px] uppercase tracking-[0.25em] text-or">
              Manifeste
            </h3>
            <p className="max-w-prose font-serif italic text-ivoire/85 text-lg leading-[1.6] print:text-noir">
              Chams Adams est une maison qui prend le temps. Le temps des
              mains, des mesures, du tombé. Le kaftan subsaharien — héritier du
              grand boubou ouest-africain — est notre langue. Nous le tissons
              avec la précision d&apos;un atelier de couture, et la mémoire
              d&apos;un peuple.
            </p>
          </section>

          {/* Chiffres clés */}
          <section className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <Stat label="Création" value="2024" />
            <Stat label="Ateliers" value="Paris · Dakar" />
            <Stat label="Pièces / an" value="~ 800" />
            <Stat label="Sur-mesure" value="60 %" />
          </section>

          {/* Contacts */}
          <section className="flex flex-col gap-4">
            <h3 className="font-sans text-[11px] uppercase tracking-[0.25em] text-or">
              Contact presse
            </h3>
            <div className="flex flex-col gap-1 font-serif text-ivoire/85 print:text-noir">
              <p>
                <strong>Adams Chamsy</strong> — Direction artistique
              </p>
              <p>presse@chams-adams.com · +33 (0)1 00 00 00 00</p>
              <p className="font-sans text-xs italic text-ivoire/60 print:text-bronze">
                Visuels haute définition disponibles sur demande
              </p>
            </div>
          </section>

          {/* Revue de presse */}
          {press.length > 0 && (
            <section className="flex flex-col gap-4">
              <h3 className="font-sans text-[11px] uppercase tracking-[0.25em] text-or">
                Revue de presse
              </h3>
              <ul className="flex flex-col gap-4 print:gap-3">
                {press.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-col gap-1 border-l-2 border-or/40 pl-4"
                  >
                    <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-or">
                      {p.publication} ·{' '}
                      {DATE_FMT.format(new Date(p.published_at))}
                    </span>
                    <p className="font-serif text-ivoire print:text-noir">
                      {p.title}
                    </p>
                    {p.excerpt && (
                      <p className="font-serif italic text-sm text-ivoire/70 print:text-bronze">
                        « {p.excerpt} »
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Link
            href="/presse"
            className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-ivoire/70 hover:text-or print:hidden"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Retour à l&apos;espace presse
          </Link>
        </div>
      </article>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-t border-bronze/30 pt-3">
      <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-or">
        {label}
      </span>
      <span className="font-serif text-2xl font-light text-ivoire print:text-noir">
        {value}
      </span>
    </div>
  );
}
