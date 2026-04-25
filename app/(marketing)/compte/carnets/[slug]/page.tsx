import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Share2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from '@/lib/supabase/server';
import type {
  EventCarnetItemRow,
  EventCarnetRow,
} from '@/lib/supabase/types';
import { getProductBySlug } from '@/lib/data/products';
import { getPrimaryImage } from '@/lib/types/product';
import { Price } from '@/components/ui/Price';
import {
  addCarnetItemAction,
  removeCarnetItemAction,
} from '../actions';

export const metadata: Metadata = {
  title: 'Carnet de cérémonie',
};

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export default async function CarnetEditPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/compte/connexion?next=/compte/carnets/${slug}`);

  const service = createSupabaseServiceClient();
  const { data: carnetData } = await service
    .from('event_carnets')
    .select('*')
    .eq('slug', slug)
    .eq('user_id', user.id)
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

  const publicUrl = `/carnet/${carnet.slug}`;

  return (
    <>
      <section className="bg-noir pt-[140px] pb-[40px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Compte', href: '/compte' },
              { label: 'Carnets', href: '/compte/carnets' },
              { label: carnet.event_name },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            {carnet.event_type}
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2rem,5vw,4rem)]"
          >
            {carnet.event_name}
          </TextReveal>
          {carnet.event_date && (
            <p className="font-serif italic text-ivoire/70 text-lg">
              {DATE_FMT.format(new Date(carnet.event_date))}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={publicUrl}
              className="inline-flex items-center gap-2 border border-or bg-or px-5 py-2.5 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
            >
              <Share2 className="h-4 w-4" aria-hidden />
              Voir l&apos;aperçu public
            </Link>
            <CopyLink slug={carnet.slug} />
          </div>
        </div>
      </section>

      <section className="bg-noir pb-[80px]">
        <div className="container-content max-w-2xl">
          <h2 className="mb-4 font-serif text-xl font-light text-ivoire">
            Ajouter une pièce au carnet
          </h2>
          <form
            action={addCarnetItemAction}
            className="flex flex-col gap-3 border border-bronze/30 p-6 md:flex-row md:items-end md:gap-4"
          >
            <input type="hidden" name="carnet_slug" value={carnet.slug} />
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
                Slug du produit (depuis l&apos;URL boutique)
              </span>
              <input
                name="product_slug"
                type="text"
                required
                placeholder="kaftan-or-ceremonie"
                className="border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center gap-2 border border-or/60 px-4 py-2.5 font-sans text-xs uppercase tracking-[0.2em] text-or hover:bg-or/10"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Ajouter
            </button>
          </form>
        </div>
      </section>

      <section className="bg-noir pb-[160px]">
        <div className="container-content">
          <h2 className="mb-6 font-serif text-xl font-light text-ivoire">
            Pièces du carnet ({items.length})
          </h2>
          {products.length === 0 ? (
            <p className="font-serif italic text-ivoire/60">
              Aucune pièce ajoutée pour le moment.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {products.map(({ item, product }) => {
                if (!product) {
                  return (
                    <li
                      key={item.id}
                      className="flex flex-col gap-3 border border-bronze/30 p-4"
                    >
                      <p className="font-serif italic text-ivoire/60">
                        Produit introuvable : {item.product_slug}
                      </p>
                      <RemoveBtn
                        carnetSlug={carnet.slug}
                        productSlug={item.product_slug}
                      />
                    </li>
                  );
                }
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
                      <p className="font-sans text-sm tracking-[0.1em] text-ivoire/80">
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
                    <RemoveBtn
                      carnetSlug={carnet.slug}
                      productSlug={item.product_slug}
                    />
                  </li>
                );
              })}
            </ul>
          )}

          <Link
            href="/compte/carnets"
            className="mt-12 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-ivoire/70 hover:text-or"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Mes carnets
          </Link>
        </div>
      </section>
    </>
  );
}

function RemoveBtn({
  carnetSlug,
  productSlug,
}: {
  carnetSlug: string;
  productSlug: string;
}) {
  return (
    <form action={removeCarnetItemAction} className="self-start">
      <input type="hidden" name="carnet_slug" value={carnetSlug} />
      <input type="hidden" name="product_slug" value={productSlug} />
      <button
        type="submit"
        aria-label="Retirer du carnet"
        className="inline-flex items-center gap-1 font-sans text-[11px] italic text-ivoire/60 hover:text-destructive"
      >
        <Trash2 className="h-3 w-3" aria-hidden />
        Retirer
      </button>
    </form>
  );
}

function CopyLink({ slug }: { slug: string }) {
  return (
    <a
      href={`/carnet/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/70 hover:text-or"
    >
      Lien public à partager →
    </a>
  );
}
