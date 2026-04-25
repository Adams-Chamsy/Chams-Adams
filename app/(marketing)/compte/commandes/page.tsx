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
import type { OrderRow, OrderItemRow, OrderStatus } from '@/lib/supabase/types';

export const metadata: Metadata = {
  title: 'Mes commandes',
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'En attente',
  paid: 'Payée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
  refunded: 'Remboursée',
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  pending: 'border-ivoire/30 text-ivoire/60',
  paid: 'border-or/60 text-or',
  shipped: 'border-or/60 text-or',
  delivered: 'border-emerald-500/60 text-emerald-300',
  cancelled: 'border-destructive/60 text-destructive',
  refunded: 'border-destructive/60 text-destructive',
};

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

const EUR = (cents: number, currency = 'EUR') =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);

type OrderWithItems = OrderRow & { items: OrderItemRow[] };

export default async function MesCommandesPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) redirect('/compte/connexion?next=/compte/commandes');

  const service = createSupabaseServiceClient();
  const { data: orders } = await service
    .from('orders')
    .select('*')
    .eq('email', user.email)
    .order('created_at', { ascending: false });

  let withItems: OrderWithItems[] = [];
  if (orders && orders.length > 0) {
    const orderIds = orders.map((o) => o.id);
    const { data: items } = await service
      .from('order_items')
      .select('*')
      .in('order_id', orderIds);

    withItems = (orders as OrderRow[]).map((o) => ({
      ...o,
      items: ((items ?? []) as OrderItemRow[]).filter(
        (i) => i.order_id === o.id
      ),
    }));
  }

  return (
    <>
      <section className="bg-noir pt-[140px] pb-[60px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Compte', href: '/compte' },
              { label: 'Commandes' },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Historique
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.5rem,5.5vw,4.5rem)]"
          >
            Mes commandes
          </TextReveal>
        </div>
      </section>

      <section className="bg-noir pb-[160px]">
        <div className="container-content">
          {withItems.length === 0 ? (
            <p className="font-serif italic text-ivoire/70 text-lg">
              Aucune commande pour le moment.{' '}
              <Link href="/boutique" className="text-or hover:underline">
                Explorer la boutique
              </Link>
              .
            </p>
          ) : (
            <ul className="flex flex-col gap-12">
              {withItems.map((order) => (
                <li
                  key={order.id}
                  className="border border-bronze/30 p-6 md:p-8"
                >
                  <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-bronze/20 pb-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-or">
                        Commande n°{' '}
                        {(order.stripe_session_id ?? order.id)
                          .slice(-8)
                          .toUpperCase()}
                      </span>
                      <span className="font-serif italic text-sm text-ivoire/60">
                        {DATE_FMT.format(new Date(order.created_at))}
                      </span>
                    </div>
                    <span
                      className={`inline-block border px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] ${STATUS_BADGE[order.status]}`}
                    >
                      {STATUS_LABEL[order.status]}
                    </span>
                  </header>

                  <ul className="flex flex-col gap-3 font-serif text-ivoire">
                    {order.items.map((it) => (
                      <li
                        key={it.id}
                        className="flex flex-wrap items-baseline justify-between gap-2"
                      >
                        <span>
                          {it.product_name}
                          {it.size ? ` · taille ${it.size}` : ''} ·{' '}
                          <span className="text-ivoire/60">×{it.quantity}</span>
                        </span>
                        <span className="font-sans text-sm tracking-[0.1em]">
                          {EUR(it.line_total_cents, order.currency)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-6 grid gap-2 border-t border-bronze/20 pt-4 font-sans text-sm text-ivoire/80">
                    <Row
                      label="Sous-total"
                      value={EUR(order.subtotal_cents, order.currency)}
                    />
                    <Row
                      label="Livraison"
                      value={
                        order.shipping_cents > 0
                          ? EUR(order.shipping_cents, order.currency)
                          : 'Offerte'
                      }
                    />
                    <div className="mt-2 flex items-baseline justify-between border-t border-bronze/20 pt-3 font-serif text-ivoire">
                      <dt className="font-sans text-xs uppercase tracking-[0.25em] text-or/80">
                        Total
                      </dt>
                      <dd className="font-sans text-base tracking-[0.1em]">
                        {EUR(order.total_cents, order.currency)}
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
