import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import { CountdownBadge } from '@/components/sections/CountdownBadge';
import { ProductCard } from '@/components/product/ProductCard';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { SeasonalTakeoverRow } from '@/lib/supabase/types';
import { getProductBySlug } from '@/lib/data/products';

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export async function generateStaticParams() {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from('seasonal_takeovers')
    .select('slug')
    .eq('published', true);
  return ((data ?? []) as { slug: string }[]).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from('seasonal_takeovers')
    .select('title, hero_subtitle, hero_image_url')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (!data) return { title: 'Cérémonie' };
  return {
    title: `${data.title} — Chams Adams`,
    description:
      (data.hero_subtitle as string | null) ?? `Sélection ${data.title}`,
    openGraph: {
      title: `${data.title} — Chams Adams`,
      description: (data.hero_subtitle as string | null) ?? undefined,
      images: data.hero_image_url
        ? [data.hero_image_url as string]
        : undefined,
    },
  };
}

export default async function CeremoniePage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from('seasonal_takeovers')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (!data) notFound();
  const t = data as SeasonalTakeoverRow;

  const products = (
    await Promise.all(t.curated_product_slugs.map((s) => getProductBySlug(s)))
  ).filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <>
      {/* HERO */}
      <section className="relative flex h-[80vh] min-h-[600px] items-end overflow-hidden bg-noir">
        {t.hero_image_url ? (
          <Image
            src={t.hero_image_url}
            alt={t.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
        ) : null}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-noir/40 via-noir/30 to-noir"
        />
        <div className="container-content relative z-10 flex flex-col gap-6 pb-20 md:pb-28">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Cérémonies' },
              { label: t.title },
            ]}
          />
          {t.hero_eyebrow && (
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
              {t.hero_eyebrow}
            </span>
          )}
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            className="font-serif font-light leading-[1.02] text-ivoire text-[clamp(3rem,7vw,6rem)]"
          >
            {t.title}
          </TextReveal>
          <p className="max-w-prose font-serif italic text-ivoire/80 text-xl md:text-2xl">
            {t.hero_subtitle ?? `${DATE_FMT.format(new Date(t.event_date))}`}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <CountdownBadge target={t.event_date} />
            {t.delivery_deadline && (
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
                Livraison garantie commandée avant le{' '}
                {DATE_FMT.format(new Date(t.delivery_deadline))}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      {t.description && (
        <section className="bg-noir py-[100px] md:py-[140px]">
          <div className="container-content max-w-3xl">
            <p className="font-serif italic text-ivoire/85 text-xl leading-[1.6]">
              {t.description}
            </p>
          </div>
        </section>
      )}

      {/* SÉLECTION */}
      <section className="bg-noir pb-[160px]">
        <div className="container-content">
          <header className="mb-12 flex flex-col gap-3 md:mb-16">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
              La sélection
            </span>
            <h2 className="font-serif font-light text-ivoire text-[clamp(2rem,4vw,3.5rem)] leading-tight">
              Pièces curées pour {t.title}
            </h2>
          </header>

          {products.length === 0 ? (
            <p className="font-serif italic text-ivoire/60">
              La sélection est en cours de composition.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
              {products.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          )}

          <div className="mt-16">
            <Link
              href="/sur-mesure"
              data-cursor="magnetic"
              className="btn-or"
            >
              {t.cta_label}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
