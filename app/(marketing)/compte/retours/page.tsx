import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from '@/lib/supabase/server';
import type { ReturnRequestRow, ReturnStatus } from '@/lib/supabase/types';

export const metadata: Metadata = {
  title: 'Mes retours',
};

const STATUS_LABEL: Record<ReturnStatus, string> = {
  pending: 'En cours d’étude',
  approved: 'Approuvée',
  received: 'Pièce reçue',
  refunded: 'Remboursée',
  rejected: 'Refusée',
};

const STATUS_BADGE: Record<ReturnStatus, string> = {
  pending: 'border-ivoire/30 text-ivoire/60',
  approved: 'border-or/60 text-or',
  received: 'border-or/60 text-or',
  refunded: 'border-emerald-500/60 text-emerald-300',
  rejected: 'border-destructive/60 text-destructive',
};

const REASON_LABEL: Record<string, string> = {
  taille: 'Taille incorrecte',
  qualite: 'Question de qualité',
  'pas-conforme': 'Non conforme',
  'changement-avis': 'Changement d’avis',
  defaut: 'Défaut',
  autre: 'Autre',
};

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export default async function MesRetoursPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) redirect('/compte/connexion?next=/compte/retours');

  const service = createSupabaseServiceClient();
  const { data } = await service
    .from('return_requests')
    .select('*')
    .eq('email', user.email)
    .order('created_at', { ascending: false });

  const items = (data ?? []) as ReturnRequestRow[];

  return (
    <>
      <section className="bg-noir pt-[140px] pb-[60px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Compte', href: '/compte' },
              { label: 'Retours' },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Suivi
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.5rem,5.5vw,4.5rem)]"
          >
            Mes retours
          </TextReveal>
        </div>
      </section>

      <section className="bg-noir pb-[160px]">
        <div className="container-content">
          {items.length === 0 ? (
            <p className="font-serif italic text-ivoire/70 text-lg">
              Aucune demande de retour.{' '}
              <Link href="/retours/demande" className="text-or hover:underline">
                Initier une demande
              </Link>
              .
            </p>
          ) : (
            <ul className="flex flex-col gap-6">
              {items.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-col gap-3 border border-bronze/30 p-6"
                >
                  <header className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-or">
                        {DATE_FMT.format(new Date(r.created_at))}
                      </span>
                      <span className="font-serif italic text-ivoire">
                        Motif : {REASON_LABEL[r.reason] ?? r.reason}
                      </span>
                    </div>
                    <span
                      className={`inline-block border px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] ${STATUS_BADGE[r.status]}`}
                    >
                      {STATUS_LABEL[r.status]}
                    </span>
                  </header>
                  {r.details && (
                    <p className="font-serif italic text-sm text-ivoire/70">
                      {r.details}
                    </p>
                  )}
                  {r.order_id && (
                    <p className="font-sans text-xs text-ivoire/50">
                      Commande n°{r.order_id}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Link href="/retours/demande" className="btn-or">
              Nouvelle demande
            </Link>
            <Link
              href="/compte"
              className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-ivoire/70 hover:text-or"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Retour au compte
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
