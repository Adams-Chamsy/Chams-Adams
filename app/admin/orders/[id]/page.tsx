import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { OrderRow, OrderItemRow, OrderStatus } from '@/lib/supabase/types';
import { updateOrderStatusAction } from '../actions';

const STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Payée' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
  { value: 'refunded', label: 'Remboursée' },
];

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

function formatCents(cents: number, currency: string): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export default async function AdminOrderDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = createSupabaseServiceClient();

  const [orderRes, itemsRes] = await Promise.all([
    supabase.from('orders').select('*').eq('id', id).maybeSingle(),
    supabase.from('order_items').select('*').eq('order_id', id),
  ]);

  if (orderRes.error || !orderRes.data) notFound();
  const order = orderRes.data as OrderRow;
  const items = (itemsRes.data ?? []) as OrderItemRow[];
  const address = order.shipping_address as {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    postal_code?: string;
    country?: string;
    phone?: string;
  } | null;

  const stripeUrl = order.stripe_session_id
    ? `https://dashboard.stripe.com/payments/${order.stripe_payment_intent_id ?? ''}`
    : null;

  const bound = updateOrderStatusAction.bind(null, id);

  return (
    <section className="flex max-w-4xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/admin/orders"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/55 hover:text-or"
        >
          ← Commandes
        </Link>
        <h1 className="font-serif text-3xl font-light text-ivoire md:text-4xl">
          Commande #{id.slice(0, 8)}
        </h1>
        <p className="font-sans text-sm italic text-ivoire/60">
          Passée le {DATE_FMT.format(new Date(order.created_at))}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Items */}
        <section aria-label="Pièces commandées" className="flex flex-col gap-5">
          <h2 className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Pièces
          </h2>
          <ul className="flex flex-col divide-y divide-bronze/15 border-y border-bronze/15">
            {items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-5 py-4">
                <div className="flex flex-col gap-1">
                  <p className="font-serif text-lg text-ivoire">{item.product_name}</p>
                  <p className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/55">
                    {[item.variant_color_name, item.size, `×${item.quantity}`]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
                <p className="whitespace-nowrap font-sans tracking-[0.1em] text-ivoire/85">
                  {formatCents(item.line_total_cents, order.currency)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="flex flex-col gap-2 font-sans text-sm">
            <Line label="Sous-total" value={formatCents(order.subtotal_cents, order.currency)} />
            <Line label="Livraison" value={formatCents(order.shipping_cents, order.currency)} />
            <Line
              label="Total"
              value={formatCents(order.total_cents, order.currency)}
              strong
            />
          </dl>
        </section>

        {/* Client + statut */}
        <aside className="flex flex-col gap-8">
          <section className="flex flex-col gap-3">
            <h2 className="font-sans text-xs uppercase tracking-[0.3em] text-or">
              Statut
            </h2>
            <form action={bound} className="flex items-end gap-3">
              <label className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="sr-only">Statut</span>
                <select
                  name="status"
                  defaultValue={order.status}
                  className="border-b border-bronze/40 bg-transparent py-2 font-serif text-lg text-ivoire focus:border-or focus:outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value} className="bg-noir">
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="inline-flex items-center border border-or bg-or px-4 py-2 font-sans text-xs uppercase tracking-[0.2em] text-noir hover:shadow-halo-or-strong"
              >
                Mettre à jour
              </button>
            </form>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-sans text-xs uppercase tracking-[0.3em] text-or">
              Client
            </h2>
            <div className="flex flex-col gap-1 font-serif text-ivoire/80">
              <p>{order.email}</p>
              {order.user_id && (
                <Link
                  href={`/admin/customers/${order.user_id}`}
                  className="font-sans text-xs uppercase tracking-[0.2em] text-or hover:underline"
                >
                  Voir le profil client →
                </Link>
              )}
            </div>
          </section>

          {address && (
            <section className="flex flex-col gap-3">
              <h2 className="font-sans text-xs uppercase tracking-[0.3em] text-or">
                Adresse de livraison
              </h2>
              <address className="font-serif not-italic leading-relaxed text-ivoire/80">
                {address.name && <>{address.name}<br /></>}
                {address.line1 && <>{address.line1}<br /></>}
                {address.line2 && <>{address.line2}<br /></>}
                {[address.postal_code, address.city].filter(Boolean).join(' ')}<br />
                {address.country}
                {address.phone && <><br /><span className="font-sans text-sm">{address.phone}</span></>}
              </address>
            </section>
          )}

          {stripeUrl && (
            <section className="flex flex-col gap-2">
              <h2 className="font-sans text-xs uppercase tracking-[0.3em] text-or">
                Stripe
              </h2>
              <a
                href={stripeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-or hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Voir dans le dashboard Stripe
              </a>
              <p className="font-sans text-[11px] italic text-ivoire/50">
                Session: {order.stripe_session_id?.slice(0, 20)}…
              </p>
            </section>
          )}
        </aside>
      </div>
    </section>
  );
}

function Line({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <dt className="font-sans uppercase tracking-[0.2em] text-ivoire/60">{label}</dt>
      <dd className={strong ? 'text-lg font-serif text-ivoire' : 'text-ivoire/80'}>
        {value}
      </dd>
    </div>
  );
}
