import Link from 'next/link';
import { createSupabaseServerClient, isSupabaseEnabled } from '@/lib/supabase/server';

type Counts = {
  orders: number;
  revenue_cents: number;
  customers: number;
  newsletter: number;
  faq: number;
  events: number;
  press: number;
  articles: number;
  products: number;
  collections: number;
};

async function getCounts(): Promise<Counts> {
  const empty: Counts = {
    orders: 0,
    revenue_cents: 0,
    customers: 0,
    newsletter: 0,
    faq: 0,
    events: 0,
    press: 0,
    articles: 0,
    products: 0,
    collections: 0,
  };
  if (!isSupabaseEnabled()) return empty;
  try {
    const supabase = await createSupabaseServerClient();

    // Counts par table + revenue
    const [
      faqCount,
      eventsCount,
      pressCount,
      articlesCount,
      productsCount,
      collectionsCount,
      ordersRows,
      newsletterCount,
    ] = await Promise.all([
      supabase.from('faq_items').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('press_entries').select('*', { count: 'exact', head: true }),
      supabase.from('articles').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('collections').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total_cents, status'),
      supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .is('unsubscribed_at', null),
    ]);

    // Customers via auth admin API
    const { data: usersRes } = await supabase.auth.admin.listUsers({ perPage: 200 });
    const customersCount = usersRes?.users?.length ?? 0;

    const orders = ordersRows.data ?? [];
    const revenue = orders
      .filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')
      .reduce((sum, o) => sum + (o.total_cents as number), 0);

    return {
      orders: orders.length,
      revenue_cents: revenue,
      customers: customersCount,
      newsletter: newsletterCount.count ?? 0,
      faq: faqCount.count ?? 0,
      events: eventsCount.count ?? 0,
      press: pressCount.count ?? 0,
      articles: articlesCount.count ?? 0,
      products: productsCount.count ?? 0,
      collections: collectionsCount.count ?? 0,
    };
  } catch {
    return empty;
  }
}

type Card = {
  key: keyof Counts;
  label: string;
  href: string;
  format?: (n: number) => string;
  active?: boolean;
};

const money = (cents: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(cents / 100);

const CARDS_BUSINESS: Card[] = [
  { key: 'orders', label: 'Commandes', href: '/admin/orders', active: true },
  {
    key: 'revenue_cents',
    label: 'CA (hors annulées)',
    href: '/admin/orders',
    format: money,
    active: true,
  },
  { key: 'customers', label: 'Clients', href: '/admin/customers', active: true },
  { key: 'newsletter', label: 'Newsletter (actifs)', href: '/admin/newsletter', active: true },
];

const CARDS_CONTENT: Card[] = [
  { key: 'products', label: 'Produits', href: '/admin/products', active: true },
  { key: 'collections', label: 'Collections', href: '/admin/collections', active: true },
  { key: 'articles', label: 'Articles Journal', href: '/admin/articles', active: true },
  { key: 'events', label: 'Événements', href: '/admin/events', active: true },
  { key: 'press', label: 'Revue de presse', href: '/admin/press', active: true },
  { key: 'faq', label: 'FAQ', href: '/admin/faq', active: true },
];

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  return (
    <section className="flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
          Tableau de bord
        </span>
        <h1 className="font-serif text-3xl font-light text-ivoire md:text-4xl">
          Vue d&apos;ensemble
        </h1>
      </header>

      <div className="flex flex-col gap-4">
        <h2 className="font-sans text-[11px] uppercase tracking-[0.3em] text-or/80">
          Business
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS_BUSINESS.map((c) => (
            <DashCard key={c.key} card={c} value={counts[c.key]} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-sans text-[11px] uppercase tracking-[0.3em] text-or/80">
          Contenu
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS_CONTENT.map((c) => (
            <DashCard key={c.key} card={c} value={counts[c.key]} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DashCard({ card, value }: { card: Card; value: number }) {
  const display = card.format ? card.format(value) : value.toString();
  return (
    <Link
      href={card.active ? card.href : '#'}
      aria-disabled={!card.active}
      className={`flex flex-col gap-3 border border-bronze/20 p-6 transition-colors duration-300 ${
        card.active
          ? 'hover:border-or hover:bg-ivoire/[0.02]'
          : 'pointer-events-none opacity-50'
      }`}
    >
      <span className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/55">
        {card.label}
      </span>
      <span className="font-serif text-3xl font-light text-ivoire md:text-4xl">
        {display}
      </span>
      <span className="font-sans text-xs italic text-ivoire/40">
        {card.active ? 'Gérer →' : 'Bientôt'}
      </span>
    </Link>
  );
}
