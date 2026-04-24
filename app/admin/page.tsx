import Link from 'next/link';
import { createSupabaseServerClient, isSupabaseEnabled } from '@/lib/supabase/server';

type Counts = {
  faq: number;
  events: number;
  press: number;
  articles: number;
  products: number;
  collections: number;
};

async function getCounts(): Promise<Counts> {
  const empty: Counts = {
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
    const tables: (keyof Counts)[] = [
      'faq',
      'events',
      'press',
      'articles',
      'products',
      'collections',
    ];
    const map: Record<keyof Counts, string> = {
      faq: 'faq_items',
      events: 'events',
      press: 'press_entries',
      articles: 'articles',
      products: 'products',
      collections: 'collections',
    };
    const results = await Promise.all(
      tables.map((k) =>
        supabase.from(map[k]).select('*', { count: 'exact', head: true })
      )
    );
    const counts = { ...empty };
    tables.forEach((k, i) => {
      counts[k] = results[i]!.count ?? 0;
    });
    return counts;
  } catch {
    return empty;
  }
}

type Card = {
  key: keyof Counts;
  label: string;
  href: string;
  active?: boolean;
};

const CARDS: Card[] = [
  { key: 'faq', label: 'FAQ', href: '/admin/faq', active: true },
  { key: 'events', label: 'Événements', href: '/admin/events' },
  { key: 'press', label: 'Revue de presse', href: '/admin/press' },
  { key: 'articles', label: 'Articles Journal', href: '/admin/articles' },
  { key: 'products', label: 'Produits', href: '/admin/products' },
  { key: 'collections', label: 'Collections', href: '/admin/collections' },
];

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
          Tableau de bord
        </span>
        <h1 className="font-serif text-3xl font-light text-ivoire md:text-4xl">
          Vue d&apos;ensemble
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <Link
            key={c.key}
            href={c.active ? c.href : '#'}
            aria-disabled={!c.active}
            className={`flex flex-col gap-3 border border-bronze/20 p-6 transition-colors duration-300 ${
              c.active
                ? 'hover:border-or hover:bg-ivoire/[0.02]'
                : 'pointer-events-none opacity-50'
            }`}
          >
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/55">
              {c.label}
            </span>
            <span className="font-serif text-4xl font-light text-ivoire">
              {counts[c.key as keyof Counts]}
            </span>
            <span className="font-sans text-xs italic text-ivoire/40">
              {c.active ? 'Gérer →' : 'Bientôt'}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
