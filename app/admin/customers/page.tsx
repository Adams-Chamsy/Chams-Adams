import Link from 'next/link';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

type CustomerSummary = {
  id: string;
  email: string | undefined;
  created_at: string;
  last_sign_in_at: string | null | undefined;
  orders_count: number;
  total_spent_cents: number;
};

async function getCustomers(): Promise<CustomerSummary[]> {
  const supabase = createSupabaseServiceClient();

  // 1. Users via Auth admin API
  const { data: usersResult, error } = await supabase.auth.admin.listUsers({
    perPage: 200,
  });
  if (error) {
    console.error('[admin/customers]', error);
    return [];
  }
  const users = usersResult.users ?? [];

  // 2. Orders aggregés par user_id pour compteurs
  const { data: orders } = await supabase
    .from('orders')
    .select('user_id, total_cents, status');

  const stats = new Map<string, { count: number; total: number }>();
  (orders ?? []).forEach((o) => {
    if (!o.user_id || o.status === 'cancelled') return;
    const s = stats.get(o.user_id) ?? { count: 0, total: 0 };
    s.count += 1;
    s.total += o.total_cents as number;
    stats.set(o.user_id, s);
  });

  return users.map((u) => {
    const s = stats.get(u.id);
    return {
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      orders_count: s?.count ?? 0,
      total_spent_cents: s?.total ?? 0,
    };
  });
}

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function formatCents(cents: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <section className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow={`${customers.length} client${customers.length > 1 ? 's' : ''}`}
        title="Clients"
      />

      {customers.length === 0 ? (
        <p className="font-serif italic text-ivoire/60">Aucun compte client.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-bronze/25 text-left font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                <th className="py-3 pr-4 font-normal">Email</th>
                <th className="py-3 pr-4 font-normal">Inscrit</th>
                <th className="py-3 pr-4 font-normal">Dernière visite</th>
                <th className="py-3 pr-4 font-normal">Commandes</th>
                <th className="py-3 pr-4 font-normal">Dépensé</th>
                <th className="py-3 font-normal">&nbsp;</th>
              </tr>
            </thead>
            <tbody className="font-serif text-ivoire">
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-bronze/10 transition-colors hover:bg-ivoire/[0.02]"
                >
                  <td className="py-4 pr-4 text-sm">{c.email ?? '—'}</td>
                  <td className="py-4 pr-4 text-sm text-ivoire/70">
                    {DATE_FMT.format(new Date(c.created_at))}
                  </td>
                  <td className="py-4 pr-4 text-sm text-ivoire/70">
                    {c.last_sign_in_at
                      ? DATE_FMT.format(new Date(c.last_sign_in_at))
                      : '—'}
                  </td>
                  <td className="py-4 pr-4 text-sm">{c.orders_count}</td>
                  <td className="py-4 pr-4 font-sans text-sm tracking-[0.1em]">
                    {c.total_spent_cents > 0
                      ? formatCents(c.total_spent_cents)
                      : '—'}
                  </td>
                  <td className="py-4">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="font-sans text-xs uppercase tracking-[0.2em] text-or hover:underline"
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
