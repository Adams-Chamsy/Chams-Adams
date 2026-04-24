import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { OrderRow } from '@/lib/supabase/types';

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
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

type WishlistJoin = { product_id: string; created_at: string; product: { name: string; slug: string } | null };

export default async function AdminCustomerDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = createSupabaseServiceClient();

  const [userRes, ordersRes, wishlistRes] = await Promise.all([
    supabase.auth.admin.getUserById(id),
    supabase.from('orders').select('*').eq('user_id', id).order('created_at', { ascending: false }),
    supabase
      .from('wishlists')
      .select('product_id, created_at, product:products(name, slug)')
      .eq('user_id', id),
  ]);

  if (userRes.error || !userRes.data?.user) notFound();
  const user = userRes.data.user;
  const orders = (ordersRes.data ?? []) as OrderRow[];
  const wishlist = (wishlistRes.data ?? []) as unknown as WishlistJoin[];

  const totalSpent = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_cents, 0);

  return (
    <section className="flex max-w-4xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/admin/customers"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/55 hover:text-or"
        >
          ← Clients
        </Link>
        <h1 className="font-serif text-3xl font-light text-ivoire md:text-4xl">
          {user.email ?? 'Client anonyme'}
        </h1>
        <p className="font-sans text-sm italic text-ivoire/60">
          Compte créé le {DATE_FMT.format(new Date(user.created_at))}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Stat label="Commandes" value={orders.length.toString()} />
        <Stat
          label="Dépensé"
          value={totalSpent > 0 ? formatCents(totalSpent, orders[0]?.currency ?? 'EUR') : '—'}
        />
        <Stat label="Wishlist" value={wishlist.length.toString()} />
      </div>

      {/* Commandes */}
      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-xs uppercase tracking-[0.3em] text-or">
          Commandes
        </h2>
        {orders.length === 0 ? (
          <p className="font-serif italic text-ivoire/60">Aucune commande.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-bronze/15 border-y border-bronze/15">
            {orders.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="flex flex-col gap-0.5">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="font-serif text-ivoire hover:text-or"
                  >
                    #{o.id.slice(0, 8)}
                  </Link>
                  <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-ivoire/55">
                    {DATE_FMT.format(new Date(o.created_at))} · {o.status}
                  </p>
                </div>
                <p className="font-sans text-sm tracking-[0.1em] text-ivoire/85">
                  {formatCents(o.total_cents, o.currency)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Wishlist */}
      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-xs uppercase tracking-[0.3em] text-or">
          Wishlist
        </h2>
        {wishlist.length === 0 ? (
          <p className="font-serif italic text-ivoire/60">
            Aucune pièce mise de côté.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-bronze/15 border-y border-bronze/15">
            {wishlist.map((w) => (
              <li
                key={w.product_id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="flex flex-col gap-0.5">
                  {w.product?.slug ? (
                    <Link
                      href={`/produit/${w.product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-serif text-ivoire hover:text-or"
                    >
                      {w.product.name}
                    </Link>
                  ) : (
                    <span className="font-serif italic text-ivoire/60">
                      Produit supprimé
                    </span>
                  )}
                  <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-ivoire/55">
                    ajouté le {DATE_FMT.format(new Date(w.created_at))}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 border border-bronze/20 p-5">
      <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
        {label}
      </span>
      <span className="font-serif text-3xl font-light text-ivoire">{value}</span>
    </div>
  );
}
