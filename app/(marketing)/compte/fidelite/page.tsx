import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from '@/lib/supabase/server';
import type { LoyaltyPointRow } from '@/lib/supabase/types';

export const metadata: Metadata = {
  title: 'Mes points de fidélité',
};

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export default async function FidelitePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) redirect('/compte/connexion?next=/compte/fidelite');

  const service = createSupabaseServiceClient();
  const { data } = await service
    .from('loyalty_points')
    .select('*')
    .eq('email', user.email)
    .order('created_at', { ascending: false });

  const entries = (data ?? []) as LoyaltyPointRow[];
  const total = entries.reduce((s, r) => s + r.points, 0);

  return (
    <>
      <section className="bg-noir pt-[140px] pb-[60px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Compte', href: '/compte' },
              { label: 'Fidélité' },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Programme
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.5rem,5.5vw,4.5rem)]"
          >
            Points de fidélité
          </TextReveal>
        </div>
      </section>

      <section className="bg-noir pb-[60px]">
        <div className="container-content grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="border border-or/40 bg-or/5 p-8">
            <Sparkles className="h-6 w-6 text-or" aria-hidden />
            <p className="mt-3 font-sans text-[11px] uppercase tracking-[0.25em] text-or">
              Solde
            </p>
            <p className="mt-2 font-serif text-5xl font-light text-ivoire">
              {total.toLocaleString('fr-FR')} pts
            </p>
            <p className="mt-3 font-serif italic text-ivoire/70">
              Soit l&apos;équivalent de {(total / 100).toFixed(0)} € de
              réduction sur une prochaine commande.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 border border-bronze/30 p-8">
            <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-or">
              Comment ça fonctionne
            </p>
            <p className="font-serif italic text-ivoire/80">
              · 1 € dépensé = 1 point crédité
            </p>
            <p className="font-serif italic text-ivoire/80">
              · 100 pts = 1 € de remise (à activer en boutique)
            </p>
            <p className="font-serif italic text-ivoire/80">
              · Les points sont valables 24 mois
            </p>
          </div>
        </div>
      </section>

      <section className="bg-noir pb-[160px]">
        <div className="container-content">
          <h2 className="mb-6 font-serif text-2xl font-light text-ivoire">
            Historique
          </h2>
          {entries.length === 0 ? (
            <p className="font-serif italic text-ivoire/60">
              Aucun mouvement pour le moment.
            </p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-bronze/25 text-left font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                  <th className="py-3 pr-4 font-normal">Date</th>
                  <th className="py-3 pr-4 font-normal">Motif</th>
                  <th className="py-3 font-normal">Points</th>
                </tr>
              </thead>
              <tbody className="font-serif text-ivoire">
                {entries.map((e) => (
                  <tr key={e.id} className="border-b border-bronze/10">
                    <td className="py-3 pr-4 font-sans text-xs text-ivoire/60">
                      {DATE_FMT.format(new Date(e.created_at))}
                    </td>
                    <td className="py-3 pr-4 text-sm text-ivoire/80">
                      {e.reason ?? '—'}
                    </td>
                    <td
                      className={`py-3 font-sans text-sm tracking-[0.1em] ${e.points >= 0 ? 'text-or' : 'text-destructive'}`}
                    >
                      {e.points > 0 ? '+' : ''}
                      {e.points.toLocaleString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
