import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from '@/lib/supabase/server';
import type { EventCarnetRow } from '@/lib/supabase/types';
import { createCarnetAction, deleteCarnetAction } from './actions';

export const metadata: Metadata = {
  title: 'Mes carnets de cérémonie',
};

const TYPE_LABEL: Record<string, string> = {
  mariage: 'Mariage',
  tabaski: 'Tabaski',
  magal: 'Magal',
  maouloud: 'Maouloud',
  bapteme: 'Baptême',
  ceremonie: 'Cérémonie',
  autre: 'Autre',
};

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export default async function CarnetsListPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/compte/connexion?next=/compte/carnets');

  const service = createSupabaseServiceClient();
  const { data } = await service
    .from('event_carnets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const carnets = (data ?? []) as EventCarnetRow[];

  return (
    <>
      <section className="bg-noir pt-[140px] pb-[60px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Compte', href: '/compte' },
              { label: 'Carnets de cérémonie' },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Cérémonies
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.5rem,5.5vw,4.5rem)]"
          >
            Carnets de cérémonie
          </TextReveal>
          <p className="max-w-prose font-serif italic text-ivoire/75 text-lg leading-relaxed">
            Composez la liste des pièces qui marqueront votre événement —
            mariage, Tabaski, Magal — et partagez-la avec vos proches qui
            souhaitent vous offrir un présent juste.
          </p>
        </div>
      </section>

      <section className="bg-noir pb-[80px]">
        <div className="container-content max-w-3xl">
          <h2 className="mb-6 font-serif text-xl font-light text-ivoire">
            Créer un carnet
          </h2>
          <form
            action={createCarnetAction}
            className="grid grid-cols-1 gap-5 border border-bronze/30 p-6 md:p-8"
          >
            <Field label="Nom de l'événement">
              <input
                name="event_name"
                type="text"
                required
                placeholder="Mariage de Aïssatou et Mamadou"
                className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
              />
            </Field>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Type de cérémonie">
                <select
                  name="event_type"
                  defaultValue="mariage"
                  className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
                >
                  {Object.entries(TYPE_LABEL).map(([v, l]) => (
                    <option key={v} value={v} className="bg-noir">
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Date">
                <input
                  name="event_date"
                  type="date"
                  className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
                />
              </Field>
            </div>
            <Field label="Personne à honorer (optionnel)">
              <input
                name="honoree_name"
                type="text"
                placeholder="Le nom de l'honoré, ou vide si c'est pour vous-même"
                className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
              />
            </Field>
            <Field label="Mot d'accompagnement (optionnel)">
              <textarea
                name="message"
                rows={3}
                maxLength={500}
                placeholder="Un mot pour vos proches qui découvriront le carnet…"
                className="w-full border border-bronze/40 bg-transparent p-3 font-serif text-ivoire focus:border-or focus:outline-none"
              />
            </Field>
            <button
              type="submit"
              className="inline-flex items-center gap-2 self-start border border-or bg-or px-5 py-2.5 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Créer le carnet
            </button>
          </form>
        </div>
      </section>

      <section className="bg-noir pb-[160px]">
        <div className="container-content">
          <h2 className="mb-6 font-serif text-xl font-light text-ivoire">
            Mes carnets
          </h2>
          {carnets.length === 0 ? (
            <p className="font-serif italic text-ivoire/60">
              Aucun carnet pour le moment.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {carnets.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-col gap-3 border border-bronze/30 p-6"
                >
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-or">
                    {TYPE_LABEL[c.event_type] ?? 'Cérémonie'}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-ivoire">
                    {c.event_name}
                  </h3>
                  {c.event_date && (
                    <p className="font-serif italic text-sm text-ivoire/70">
                      {DATE_FMT.format(new Date(c.event_date))}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/compte/carnets/${c.slug}`}
                      className="font-sans text-xs uppercase tracking-[0.2em] text-or hover:underline"
                    >
                      Gérer →
                    </Link>
                    <Link
                      href={`/carnet/${c.slug}`}
                      className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/70 hover:text-or"
                    >
                      Aperçu public
                    </Link>
                    <form
                      action={deleteCarnetAction.bind(null, c.slug)}
                      className="ml-auto"
                    >
                      <button
                        type="submit"
                        aria-label="Supprimer"
                        className="inline-flex h-8 w-8 items-center justify-center text-ivoire/50 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/compte"
            className="mt-12 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-ivoire/70 hover:text-or"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Retour au compte
          </Link>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
        {label}
      </span>
      {children}
    </label>
  );
}
