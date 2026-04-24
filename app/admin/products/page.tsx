import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil } from 'lucide-react';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton';
import { deleteProductAction } from './actions';

type ProductListItem = {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  price_amount: number;
  price_currency: string;
  category_slug: string;
  published: boolean;
  variants: { images: { url: string; is_primary: boolean }[] }[];
};

async function getItems(): Promise<ProductListItem[]> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, slug, name, subtitle, price_amount, price_currency, category_slug, published, variants:product_variants(images:product_variant_images(url, is_primary))'
    )
    .order('created_at', { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []) as ProductListItem[];
}

function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function AdminProductsPage() {
  const items = await getItems();

  return (
    <section className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow={`Catalogue — ${items.length}`}
        title="Produits"
        publicHref="/boutique"
        publicLabel="Voir /boutique"
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 border border-or bg-or px-5 py-2.5 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Nouveau produit
          </Link>
        }
      />

      {items.length === 0 ? (
        <p className="font-serif italic text-ivoire/60">Aucun produit. Crée le premier.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-bronze/20 border-y border-bronze/20">
          {items.map((p) => {
            const firstImage = p.variants?.[0]?.images?.find((i) => i.is_primary)?.url
              ?? p.variants?.[0]?.images?.[0]?.url;
            return (
              <li key={p.id} className="flex items-start justify-between gap-6 py-5">
                <div className="flex min-w-0 items-start gap-5">
                  {firstImage ? (
                    <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-noir-800">
                      <Image src={firstImage} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-[4/5] w-16 shrink-0 border border-bronze/20" />
                  )}
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                      {p.category_slug}
                      {p.published ? (
                        <span className="ml-3 inline-block border border-or/60 px-2 py-0.5 text-or">
                          Publié
                        </span>
                      ) : (
                        <span className="ml-3 inline-block border border-ivoire/30 px-2 py-0.5 text-ivoire/60">
                          Brouillon
                        </span>
                      )}
                    </span>
                    <p className="font-serif text-lg text-ivoire">{p.name}</p>
                    {p.subtitle && (
                      <p className="truncate font-serif italic text-sm text-ivoire/55">{p.subtitle}</p>
                    )}
                    <p className="font-sans text-sm tracking-[0.1em] text-ivoire/70">
                      {formatPrice(p.price_amount, p.price_currency)} ·{' '}
                      {p.variants?.length ?? 0} variante{(p.variants?.length ?? 0) > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/products/${p.id}`}
                    aria-label="Éditer"
                    className="inline-flex h-9 w-9 items-center justify-center text-ivoire/70 hover:text-or"
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                  </Link>
                  <DeleteConfirmButton
                    action={deleteProductAction.bind(null, p.id)}
                    itemName={p.name}
                    itemLabel="ce produit"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
