import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { ReturnRequestRow, ReturnStatus } from '@/lib/supabase/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton';
import {
  deleteReturnAction,
  updateReturnStatusAction,
} from './actions';

const REASON_LABEL: Record<string, string> = {
  taille: 'Taille',
  qualite: 'Qualité',
  'pas-conforme': 'Non conforme',
  'changement-avis': 'Changement d’avis',
  defaut: 'Défaut',
  autre: 'Autre',
};

const NEXT_STATUSES: { value: ReturnStatus; label: string }[] = [
  { value: 'pending', label: 'En attente' },
  { value: 'approved', label: 'Approuvée' },
  { value: 'received', label: 'Reçue' },
  { value: 'refunded', label: 'Remboursée' },
  { value: 'rejected', label: 'Refusée' },
];

const STATUS_BADGE: Record<ReturnStatus, string> = {
  pending: 'border-ivoire/30 text-ivoire/60',
  approved: 'border-or/60 text-or',
  received: 'border-or/60 text-or',
  refunded: 'border-emerald-500/60 text-emerald-300',
  rejected: 'border-destructive/60 text-destructive',
};

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

async function getReturns(): Promise<ReturnRequestRow[]> {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from('return_requests')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as ReturnRequestRow[];
}

export default async function AdminReturnsPage() {
  const items = await getReturns();
  const pending = items.filter((r) => r.status === 'pending').length;

  return (
    <section className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow={`${pending} en attente · ${items.length} total`}
        title="Demandes de retour"
      />

      {items.length === 0 ? (
        <p className="font-serif italic text-ivoire/60">
          Aucune demande pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr className="border-b border-bronze/25 text-left font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                <th className="py-3 pr-4 font-normal">Reçu</th>
                <th className="py-3 pr-4 font-normal">Email</th>
                <th className="py-3 pr-4 font-normal">N° commande</th>
                <th className="py-3 pr-4 font-normal">Motif</th>
                <th className="py-3 pr-4 font-normal">Statut</th>
                <th className="py-3 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="font-serif text-ivoire">
              {items.map((r) => (
                <tr key={r.id} className="border-b border-bronze/10 align-top">
                  <td className="py-4 pr-4 text-sm text-ivoire/70">
                    {DATE_FMT.format(new Date(r.created_at))}
                  </td>
                  <td className="py-4 pr-4 text-sm">{r.email}</td>
                  <td className="py-4 pr-4 text-sm text-ivoire/70">
                    {r.order_id ?? '—'}
                  </td>
                  <td className="py-4 pr-4 text-sm">
                    <div>{REASON_LABEL[r.reason] ?? r.reason}</div>
                    {r.details && (
                      <p className="mt-1 max-w-xs font-serif italic text-xs text-ivoire/60">
                        {r.details}
                      </p>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-block border px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] ${STATUS_BADGE[r.status]}`}
                    >
                      {NEXT_STATUSES.find((s) => s.value === r.status)?.label ??
                        r.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <form
                        action={async (formData) => {
                          'use server';
                          const next = formData.get('status') as ReturnStatus;
                          await updateReturnStatusAction(r.id, next);
                        }}
                      >
                        <select
                          name="status"
                          defaultValue={r.status}
                          onChange={(e) => e.currentTarget.form?.requestSubmit()}
                          className="border border-bronze/40 bg-transparent px-2 py-1 font-sans text-xs text-ivoire focus:border-or focus:outline-none"
                        >
                          {NEXT_STATUSES.map((s) => (
                            <option
                              key={s.value}
                              value={s.value}
                              className="bg-noir"
                            >
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </form>
                      <DeleteConfirmButton
                        action={deleteReturnAction.bind(null, r.id)}
                        itemName={r.email}
                        itemLabel="cette demande"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
