import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { VipMemberRow, VipTier } from '@/lib/supabase/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton';
import {
  deleteVipMemberAction,
  toggleVipActiveAction,
  updateVipTierAction,
} from './actions';

const TIERS: { value: VipTier; label: string; badge: string }[] = [
  { value: 'silver', label: 'Silver', badge: 'border-ivoire/50 text-ivoire/80' },
  { value: 'gold', label: 'Gold', badge: 'border-or text-or' },
  {
    value: 'platinum',
    label: 'Platinum',
    badge: 'border-bronze/80 bg-bronze/10 text-or',
  },
];

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

async function getMembers(): Promise<VipMemberRow[]> {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from('vip_members')
    .select('*')
    .order('joined_at', { ascending: false });
  return (data ?? []) as VipMemberRow[];
}

export default async function AdminVipPage() {
  const items = await getMembers();
  const activeCount = items.filter((m) => m.active).length;

  return (
    <section className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow={`${activeCount} actif${activeCount > 1 ? 's' : ''} · ${items.length} membre${items.length > 1 ? 's' : ''}`}
        title="Cercle VIP"
        action={
          <Link
            href="/admin/vip/new"
            className="inline-flex items-center gap-2 border border-or bg-or px-5 py-2.5 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Inviter un membre
          </Link>
        }
      />

      {items.length === 0 ? (
        <p className="font-serif italic text-ivoire/60">
          Aucun membre dans le cercle. Invitez les premières figures qui
          incarnent l&apos;univers Chams Adams.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr className="border-b border-bronze/25 text-left font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                <th className="py-3 pr-4 font-normal">Membre</th>
                <th className="py-3 pr-4 font-normal">Niveau</th>
                <th className="py-3 pr-4 font-normal">Entré</th>
                <th className="py-3 pr-4 font-normal">Invité par</th>
                <th className="py-3 pr-4 font-normal">Statut</th>
                <th className="py-3 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="font-serif text-ivoire">
              {items.map((m) => (
                <tr key={m.id} className="border-b border-bronze/10 align-top">
                  <td className="py-4 pr-4 text-sm">
                    <div>{m.full_name ?? '—'}</div>
                    <div className="text-xs italic text-ivoire/60">{m.email}</div>
                    {m.notes && (
                      <p className="mt-1 max-w-xs font-serif italic text-xs text-ivoire/50">
                        {m.notes}
                      </p>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    <form
                      action={async (formData) => {
                        'use server';
                        await updateVipTierAction(
                          m.id,
                          formData.get('tier') as VipTier
                        );
                      }}
                    >
                      <select
                        name="tier"
                        defaultValue={m.tier}
                        onChange={(e) => e.currentTarget.form?.requestSubmit()}
                        className="border border-bronze/40 bg-transparent px-2 py-1 font-sans text-xs uppercase tracking-[0.15em] text-ivoire focus:border-or focus:outline-none"
                      >
                        {TIERS.map((t) => (
                          <option key={t.value} value={t.value} className="bg-noir">
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </form>
                  </td>
                  <td className="py-4 pr-4 font-sans text-xs text-ivoire/60">
                    {DATE_FMT.format(new Date(m.joined_at))}
                  </td>
                  <td className="py-4 pr-4 text-sm text-ivoire/70">
                    {m.invited_by ?? '—'}
                  </td>
                  <td className="py-4 pr-4">
                    {m.active ? (
                      <span className="inline-block border border-or/60 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-or">
                        Actif
                      </span>
                    ) : (
                      <span className="inline-block border border-ivoire/30 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-ivoire/60">
                        Inactif
                      </span>
                    )}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <form
                        action={toggleVipActiveAction.bind(
                          null,
                          m.id,
                          !m.active
                        )}
                      >
                        <button
                          type="submit"
                          className="font-sans text-xs uppercase tracking-[0.2em] text-or hover:underline"
                        >
                          {m.active ? 'Désactiver' : 'Réactiver'}
                        </button>
                      </form>
                      <DeleteConfirmButton
                        action={deleteVipMemberAction.bind(null, m.id)}
                        itemName={m.email}
                        itemLabel="ce membre"
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
