import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { GiftCardRow } from '@/lib/supabase/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton';
import {
  deleteGiftCardAction,
  toggleGiftCardActiveAction,
} from './actions';

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const EUR = (cents: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(cents / 100);

async function getCards(): Promise<GiftCardRow[]> {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from('gift_cards')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as GiftCardRow[];
}

export default async function AdminGiftCardsPage() {
  const items = await getCards();
  const activeBalance = items
    .filter((c) => c.active)
    .reduce((s, c) => s + c.remaining_cents, 0);

  return (
    <section className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow={`${items.length} carte${items.length > 1 ? 's' : ''} · solde actif ${EUR(activeBalance)}`}
        title="Cartes cadeaux"
        action={
          <Link
            href="/admin/gift-cards/new"
            className="inline-flex items-center gap-2 border border-or bg-or px-5 py-2.5 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Nouvelle carte
          </Link>
        }
      />

      {items.length === 0 ? (
        <p className="font-serif italic text-ivoire/60">
          Aucune carte cadeau émise pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr className="border-b border-bronze/25 text-left font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                <th className="py-3 pr-4 font-normal">Code</th>
                <th className="py-3 pr-4 font-normal">Bénéficiaire</th>
                <th className="py-3 pr-4 font-normal">Montant initial</th>
                <th className="py-3 pr-4 font-normal">Solde restant</th>
                <th className="py-3 pr-4 font-normal">Émise</th>
                <th className="py-3 pr-4 font-normal">Expire</th>
                <th className="py-3 pr-4 font-normal">Statut</th>
                <th className="py-3 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="font-serif text-ivoire">
              {items.map((c) => (
                <tr key={c.id} className="border-b border-bronze/10 align-top">
                  <td className="py-4 pr-4">
                    <code className="font-mono text-sm text-or">{c.code}</code>
                  </td>
                  <td className="py-4 pr-4 text-sm">
                    <div>{c.recipient_name ?? '—'}</div>
                    {c.recipient_email && (
                      <div className="text-xs italic text-ivoire/60">
                        {c.recipient_email}
                      </div>
                    )}
                  </td>
                  <td className="py-4 pr-4 font-sans text-sm tracking-[0.1em]">
                    {EUR(c.initial_amount_cents)}
                  </td>
                  <td className="py-4 pr-4 font-sans text-sm tracking-[0.1em] text-or">
                    {EUR(c.remaining_cents)}
                  </td>
                  <td className="py-4 pr-4 font-sans text-xs text-ivoire/60">
                    {DATE_FMT.format(new Date(c.created_at))}
                  </td>
                  <td className="py-4 pr-4 font-sans text-xs text-ivoire/60">
                    {c.expires_at
                      ? DATE_FMT.format(new Date(c.expires_at))
                      : '—'}
                  </td>
                  <td className="py-4 pr-4">
                    {c.active ? (
                      <span className="inline-block border border-or/60 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-or">
                        Active
                      </span>
                    ) : (
                      <span className="inline-block border border-ivoire/30 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-ivoire/60">
                        Désactivée
                      </span>
                    )}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <form
                        action={toggleGiftCardActiveAction.bind(
                          null,
                          c.id,
                          !c.active
                        )}
                      >
                        <button
                          type="submit"
                          className="font-sans text-xs uppercase tracking-[0.2em] text-or hover:underline"
                        >
                          {c.active ? 'Désactiver' : 'Réactiver'}
                        </button>
                      </form>
                      <DeleteConfirmButton
                        action={deleteGiftCardAction.bind(null, c.id)}
                        itemName={c.code}
                        itemLabel="cette carte"
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
        Les cartes émises sont utilisables manuellement (à valider en
        checkout). L&apos;intégration automatique au paiement viendra dans une
        vague dédiée.
      </p>
    </section>
  );
}
