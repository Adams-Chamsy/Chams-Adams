import Link from 'next/link';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { OrderRow, OrderStatus } from '@/lib/supabase/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { cn } from '@/lib/utils';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  paid: 'Payée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
  refunded: 'Remboursée',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'border-ivoire/30 text-ivoire/70',
  paid: 'border-or text-or',
  shipped: 'border-blue-400/60 text-blue-300',
  delivered: 'border-emerald-400/60 text-emerald-300',
  cancelled: 'border-ivoire/30 text-ivoire/40 line-through',
  refunded: 'border-destructive/60 text-destructive',
};

async function getOrders(filter: OrderStatus | 'all'): Promise<OrderRow[]> {
  const supabase = createSupabaseServiceClient();
  let q = supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (filter !== 'all') q = q.eq('status', filter);
  const { data, error } = await q;
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []) as OrderRow[];
}

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function formatCents(cents: number, currency: string): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

const FILTERS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Payées' },
  { value: 'shipped', label: 'Expédiées' },
  { value: 'delivered', label: 'Livrées' },
  { value: 'cancelled', label: 'Annulées' },
  { value: 'refunded', label: 'Remboursées' },
];

export default async function AdminOrdersPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await props.searchParams;
  const filter = (params.status as OrderStatus | 'all' | undefined) ?? 'all';
  const items = await getOrders(filter);

  return (
    <section className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow={`Commandes — ${items.length}`}
        title="Commandes"
      />

      {/* Filtres */}
      <nav aria-label="Filtrer par statut" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === 'all' ? '/admin/orders' : `/admin/orders?status=${f.value}`}
            className={cn(
              'border px-4 py-2 font-sans text-xs uppercase tracking-[0.2em] transition-colors',
              filter === f.value
                ? 'border-or bg-or text-noir'
                : 'border-bronze/40 text-ivoire/70 hover:border-or hover:text-or'
            )}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      {items.length === 0 ? (
        <p className="font-serif italic text-ivoire/60">Aucune commande pour ce filtre.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-bronze/25 text-left font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                <th className="py-3 pr-4 font-normal">Date</th>
                <th className="py-3 pr-4 font-normal">Email</th>
                <th className="py-3 pr-4 font-normal">Montant</th>
                <th className="py-3 pr-4 font-normal">Statut</th>
                <th className="py-3 pr-4 font-normal">Stripe</th>
                <th className="py-3 font-normal">&nbsp;</th>
              </tr>
            </thead>
            <tbody className="font-serif text-ivoire">
              {items.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-bronze/10 transition-colors hover:bg-ivoire/[0.02]"
                >
                  <td className="py-4 pr-4 text-sm text-ivoire/70">
                    {DATE_FMT.format(new Date(o.created_at))}
                  </td>
                  <td className="py-4 pr-4 text-sm">{o.email}</td>
                  <td className="py-4 pr-4 font-sans text-sm tracking-[0.1em]">
                    {formatCents(o.total_cents, o.currency)}
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={cn(
                        'inline-block border px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em]',
                        STATUS_COLORS[o.status]
                      )}
                    >
                      {STATUS_LABELS[o.status]}
                    </span>
                  </td>
                  <td className="py-4 pr-4 font-sans text-[11px] text-ivoire/40">
                    {o.stripe_session_id
                      ? `${o.stripe_session_id.slice(0, 14)}…`
                      : '—'}
                  </td>
                  <td className="py-4">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-sans text-xs uppercase tracking-[0.2em] text-or underline-offset-4 hover:underline"
                    >
                      Détail →
                    </Link>
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
