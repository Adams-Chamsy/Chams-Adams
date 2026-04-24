import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { PromoCodeRow } from '@/lib/supabase/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton';
import { deletePromoAction } from './actions';

async function getPromos(): Promise<PromoCodeRow[]> {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as PromoCodeRow[];
}

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function formatDiscount(p: PromoCodeRow): string {
  if (p.discount_type === 'percent') return `-${p.discount_value}%`;
  const euros = p.discount_value / 100;
  return `-${new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(euros)}`;
}

export default async function AdminPromosPage() {
  const items = await getPromos();

  return (
    <section className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow={`${items.length} code${items.length > 1 ? 's' : ''}`}
        title="Codes promo"
        action={
          <Link
            href="/admin/promos/new"
            className="inline-flex items-center gap-2 border border-or bg-or px-5 py-2.5 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Nouveau code
          </Link>
        }
      />

      {items.length === 0 ? (
        <p className="font-serif italic text-ivoire/60">
          Aucun code promo. Créez le premier pour lancer une campagne.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-bronze/25 text-left font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                <th className="py-3 pr-4 font-normal">Code</th>
                <th className="py-3 pr-4 font-normal">Libellé</th>
                <th className="py-3 pr-4 font-normal">Réduction</th>
                <th className="py-3 pr-4 font-normal">Util.</th>
                <th className="py-3 pr-4 font-normal">Validité</th>
                <th className="py-3 pr-4 font-normal">Statut</th>
                <th className="py-3 font-normal">&nbsp;</th>
              </tr>
            </thead>
            <tbody className="font-serif text-ivoire">
              {items.map((p) => (
                <tr key={p.id} className="border-b border-bronze/10">
                  <td className="py-4 pr-4">
                    <code className="font-mono text-sm text-or">{p.code}</code>
                  </td>
                  <td className="py-4 pr-4 text-sm text-ivoire/80">
                    {p.label ?? '—'}
                  </td>
                  <td className="py-4 pr-4 font-sans text-sm tracking-[0.1em]">
                    {formatDiscount(p)}
                    {p.min_amount_cents > 0 && (
                      <span className="ml-2 text-[11px] italic text-ivoire/50">
                        dès {p.min_amount_cents / 100}€
                      </span>
                    )}
                  </td>
                  <td className="py-4 pr-4 text-sm">
                    {p.uses_count}
                    {p.max_uses ? ` / ${p.max_uses}` : ''}
                  </td>
                  <td className="py-4 pr-4 font-sans text-xs text-ivoire/60">
                    {DATE_FMT.format(new Date(p.starts_at))}
                    {p.ends_at ? ` → ${DATE_FMT.format(new Date(p.ends_at))}` : ''}
                  </td>
                  <td className="py-4 pr-4">
                    {p.active ? (
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
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/promos/${p.id}`}
                        aria-label="Éditer"
                        className="inline-flex h-9 w-9 items-center justify-center text-ivoire/70 hover:text-or"
                      >
                        <Pencil className="h-4 w-4" aria-hidden />
                      </Link>
                      <DeleteConfirmButton
                        action={deletePromoAction.bind(null, p.id)}
                        itemName={p.code}
                        itemLabel="ce code promo"
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
        L&apos;application des codes au checkout sera livrée dans la vague 12.3
        (intégration Stripe Coupons).
      </p>
    </section>
  );
}
