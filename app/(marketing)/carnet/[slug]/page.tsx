import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type {
  EventCarnetItemRow,
  EventCarnetRow,
} from '@/lib/supabase/types';
import { getProductBySlug } from '@/lib/data/products';
import { getPrimaryImage } from '@/lib/types/product';
import { Price } from '@/components/ui/Price';

const TYPE_LABEL: Record<string, string> = {
  mariage: 'Mariage',
  tabaski: 'Tabaski',
  magal: 'Magal',
  maouloud: 'Maouloud',
  bapteme: 'Baptême',
  ceremonie: 'Cérémonie',
  autre: 'Cérémonie',
};

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const service = createSupabaseServiceClient();
  const { data } = await service
    .from('event_carnets')
    .select('event_name, event_type, message')
    .eq('slug', slug)
    .eq('is_public', true)
    .maybeSingle();
  if (!data) return { title: 'Carnet introuvable' };
  return {
    title: `${data.event_name} — Carnet de cérémonie`,
    description:
      (data.message as string | null) ??
      `Carnet de cérémonie partagé sur Chams Adams.`,
    robots: { index: false, follow: false }, // privé par URL
  };
}

export default async function PublicCarnetPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const service = createSupabaseServiceClient();

  const { data: carnetData } = await service
    .from('event_carnets')
    .select('*')
    .eq('slug', slug)
    .eq('is_public', true)
    .maybeSingle();
  if (!carnetData) notFound();
  const carnet = carnetData as EventCarnetRow;

  const { data: itemsData } = await service
    .from('event_carnet_items')
    .select('*')
    .eq('carnet_id', carnet.id)
    .order('added_at', { ascending: false });
  const items = (itemsData ?? []) as EventCarnetItemRow[];

  const products = await Promise.all(
    items.map(async (i) => ({
      item: i,
      product: await getProductBySlug(i.product_slug),
    }))
  );

  return (
    <>
      <section className="bg-noir pt-[140px] pb-[60px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Carnet' },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            {TYPE_LABEL[carnet.event_type] ?? 'Cérémonie'}
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.5rem,6vw,5rem)]"
          >
            {carnet.event_name}
          </TextReveal>
          {carnet.event_date && (
            <p className="font-serif italic text-ivoire/70 text-xl">
              {DATE_FMT.format(new Date(carnet.event_date))}
            </p>
          )}
          {carnet.honoree_name && (
            <p className="font-serif italic text-ivoire/70 text-lg">
              Pour {carnet.honoree_name}
            </p>
          )}
          {carnet.message && (
            <p className="max-w-prose font-serif italic text-ivoire/85 text-lg leading-relaxed">
              « {carnet.message} »
            </p>
          )}
        </div>
      </section>

      <section className="bg-noir pb-[160px]">
        <div className="container-content">
          <h2 className="mb-10 font-serif text-2xl font-light text-ivoire">
            Les pièces souhaitées
          </h2>
          {products.length === 0 ? (
            <p className="font-serif italic text-ivoire/60">
              Le carnet est en cours de composition.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {products.map(({ item, product }) => {
                if (!product) return null;
                const img = getPrimaryImage(product);
                return (
                  <li key={item.id} className="flex flex-col gap-3">
                    <Link
                      href={`/produit/${product.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-noir-800">
                        <Image
                          src={img.url}
                          alt={img.alt}
                          fill
                          sizes="(max-width: 768px) 90vw, 30vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      </div>
                      <h3 className="mt-3 font-serif text-lg text-ivoire group-hover:text-or">
                        {product.name}
                      </h3>
                      {product.subtitle && (
                        <p className="font-serif italic text-sm text-ivoire/60">
                          {product.subtitle}
                        </p>
                      )}
                      <p className="mt-1 font-sans text-sm tracking-[0.1em] text-ivoire/80">
                        <Price
                          cents={Math.round(product.price.amount * 100)}
                          baseCurrency={product.price.currency}
                        />
                      </p>
                    </Link>
                    {item.reserved_by_email && (
                      <span className="inline-block self-start border border-or/60 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-or">
                        Réservée
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <p className="mt-16 max-w-prose font-serif italic text-ivoire/60">
            Vous souhaitez offrir une pièce ? Cliquez dessus, finalisez votre
            achat, et précisez en commentaire qu&apos;il s&apos;agit du carnet «{' '}
            {carnet.event_name} ».
          </p>
        </div>
      </section>
    </>
  );
}
