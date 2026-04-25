import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { LoyaltyPointRow } from '@/lib/supabase/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton';
import {
  deleteLoyaltyEntryAction,
  grantLoyaltyPointsAction,
} from './actions';

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

type Aggregated = { email: string; total: number; count: number };

async function getEntries(): Promise<LoyaltyPointRow[]> {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from('loyalty_points')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as LoyaltyPointRow[];
}

function aggregateByEmail(rows: LoyaltyPointRow[]): Aggregated[] {
  const map = new Map<string, Aggregated>();
  for (const r of rows) {
    const cur = map.get(r.email) ?? { email: r.email, total: 0, count: 0 };
    cur.total += r.points;
    cur.count += 1;
    map.set(r.email, cur);
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export default async function AdminLoyaltyPage() {
  const entries = await getEntries();
  const balances = aggregateByEmail(entries);

  return (
    <section className="flex flex-col gap-10">
      <AdminPageHeader
        eyebrow={`${balances.length} client${balances.length > 1 ? 's' : ''} fidèle${balances.length > 1 ? 's' : ''}`}
        title="Programme fidélité"
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Soldes par email */}
        <div className="lg:col-span-7">
          <h2 className="mb-4 font-serif text-xl font-light text-ivoire">
            Soldes
          </h2>
          {balances.length === 0 ? (
            <p className="font-serif italic text-ivoire/60">
              Aucun point attribué pour le moment.
            </p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-bronze/25 text-left font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                  <th className="py-3 pr-4 font-normal">Email</th>
                  <th className="py-3 pr-4 font-normal">Solde</th>
                  <th className="py-3 font-normal">Mvts</th>
                </tr>
              </thead>
              <tbody className="font-serif text-ivoire">
                {balances.map((b) => (
                  <tr key={b.email} className="border-b border-bronze/10">
                    <td className="py-3 pr-4 text-sm">{b.email}</td>
                    <td className="py-3 pr-4 font-sans text-sm tracking-[0.1em] text-or">
                      {b.total.toLocaleString('fr-FR')} pts
                    </td>
                    <td className="py-3 font-sans text-xs text-ivoire/60">
                      {b.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Formulaire d'attribution */}
        <aside className="lg:col-span-5">
          <h2 className="mb-4 font-serif text-xl font-light text-ivoire">
            Attribuer des points
          </h2>
          <form
            action={grantLoyaltyPointsAction}
            className="flex flex-col gap-5 border border-bronze/30 p-6"
          >
            <Field label="Email du client">
              <input
                name="email"
                type="email"
                required
                className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
              />
            </Field>
            <Field label="Points (peut être négatif)">
              <input
                name="points"
                type="number"
                step={1}
                required
                defaultValue={100}
                className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
              />
            </Field>
            <Field label="Motif (optionnel)">
              <input
                name="reason"
                type="text"
                placeholder="ex: parrainage, geste commercial, retour"
                className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
              />
            </Field>
            <button
              type="submit"
              className="self-start border border-or bg-or px-5 py-2.5 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
            >
              Créditer
            </button>
          </form>
          <p className="mt-3 font-serif italic text-xs text-ivoire/50">
            Règle automatique : 1 € dépensé = 1 point. Crédité après
            confirmation de paiement.
          </p>
        </aside>
      </div>

      {/* Historique */}
      <div>
        <h2 className="mb-4 font-serif text-xl font-light text-ivoire">
          Historique
        </h2>
        {entries.length === 0 ? (
          <p className="font-serif italic text-ivoire/60">
            Aucun mouvement.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="border-b border-bronze/25 text-left font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                  <th className="py-3 pr-4 font-normal">Date</th>
                  <th className="py-3 pr-4 font-normal">Email</th>
                  <th className="py-3 pr-4 font-normal">Points</th>
                  <th className="py-3 pr-4 font-normal">Motif</th>
                  <th className="py-3 font-normal">Action</th>
                </tr>
              </thead>
              <tbody className="font-serif text-ivoire">
                {entries.map((e) => (
                  <tr key={e.id} className="border-b border-bronze/10">
                    <td className="py-3 pr-4 font-sans text-xs text-ivoire/60">
                      {DATE_FMT.format(new Date(e.created_at))}
                    </td>
                    <td className="py-3 pr-4 text-sm">{e.email}</td>
                    <td
                      className={`py-3 pr-4 font-sans text-sm tracking-[0.1em] ${e.points >= 0 ? 'text-or' : 'text-destructive'}`}
                    >
                      {e.points > 0 ? '+' : ''}
                      {e.points.toLocaleString('fr-FR')}
                    </td>
                    <td className="py-3 pr-4 text-sm text-ivoire/70">
                      {e.reason ?? '—'}
                    </td>
                    <td className="py-3">
                      <DeleteConfirmButton
                        action={deleteLoyaltyEntryAction.bind(null, e.id)}
                        itemName={`${e.points} pts à ${e.email}`}
                        itemLabel="ce mouvement"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
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
