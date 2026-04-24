import { Download, Check } from 'lucide-react';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { WaitlistEntryRow } from '@/lib/supabase/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton';
import {
  deleteWaitlistEntryAction,
  markNotifiedAction,
} from './actions';

type Row = WaitlistEntryRow & { product: { name: string } | null };

async function getEntries(): Promise<Row[]> {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from('waitlist_entries')
    .select('*, product:products(name)')
    .order('created_at', { ascending: false });
  return (data ?? []) as unknown as Row[];
}

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function exportCsvHref(rows: Row[]): string {
  const csv = [
    'email,product_slug,size,created_at,notified_at',
    ...rows.map(
      (r) =>
        `${r.email},${r.product_slug},${r.size ?? ''},${r.created_at},${r.notified_at ?? ''}`
    ),
  ].join('\n');
  return `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
}

export default async function AdminWaitlistPage() {
  const items = await getEntries();
  const pending = items.filter((r) => !r.notified_at).length;

  return (
    <section className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow={`${pending} en attente de notification · ${items.length} total`}
        title="Liste d'attente"
        action={
          items.length > 0 ? (
            <a
              href={exportCsvHref(items)}
              download={`waitlist-${new Date().toISOString().slice(0, 10)}.csv`}
              className="inline-flex items-center gap-2 border border-or/60 px-4 py-2 font-sans text-xs uppercase tracking-[0.2em] text-or hover:bg-or/10"
            >
              <Download className="h-4 w-4" aria-hidden />
              Export CSV
            </a>
          ) : undefined
        }
      />

      {items.length === 0 ? (
        <p className="font-serif italic text-ivoire/60">
          Aucune inscription. Les clients peuvent cliquer "Prévenez-moi" sur
          un produit en rupture.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-bronze/25 text-left font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                <th className="py-3 pr-4 font-normal">Email</th>
                <th className="py-3 pr-4 font-normal">Produit</th>
                <th className="py-3 pr-4 font-normal">Taille</th>
                <th className="py-3 pr-4 font-normal">Demandé</th>
                <th className="py-3 pr-4 font-normal">Statut</th>
                <th className="py-3 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="font-serif text-ivoire">
              {items.map((r) => (
                <tr key={r.id} className="border-b border-bronze/10">
                  <td className="py-4 pr-4 text-sm">{r.email}</td>
                  <td className="py-4 pr-4 text-sm">
                    {r.product?.name ?? r.product_slug}
                  </td>
                  <td className="py-4 pr-4 text-sm text-ivoire/70">
                    {r.size ?? '—'}
                  </td>
                  <td className="py-4 pr-4 text-sm text-ivoire/70">
                    {DATE_FMT.format(new Date(r.created_at))}
                  </td>
                  <td className="py-4 pr-4">
                    {r.notified_at ? (
                      <span className="inline-flex items-center gap-1 border border-or/50 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-or">
                        <Check className="h-3 w-3" aria-hidden />
                        Notifié
                      </span>
                    ) : (
                      <span className="inline-block border border-ivoire/30 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-ivoire/60">
                        En attente
                      </span>
                    )}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      {!r.notified_at && (
                        <form action={markNotifiedAction.bind(null, r.id)}>
                          <button
                            type="submit"
                            className="font-sans text-xs uppercase tracking-[0.2em] text-or hover:underline"
                          >
                            Marquer notifié
                          </button>
                        </form>
                      )}
                      <DeleteConfirmButton
                        action={deleteWaitlistEntryAction.bind(null, r.id)}
                        itemName={r.email}
                        itemLabel="cette entrée"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="font-serif italic text-sm text-ivoire/50">
        Pour notifier : exporte le CSV filtré → envoie l&apos;email depuis
        Resend/Brevo → reviens marquer chaque entrée comme notifiée.
        L&apos;envoi automatique arrivera dans une vague dédiée.
      </p>
    </section>
  );
}
