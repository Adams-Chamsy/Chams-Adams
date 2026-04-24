import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { COLLECTIONS } from '@/lib/data/collections.mock';
import type { ProductRow } from '@/lib/supabase/types';
import { ProductForm } from '../ProductForm';
import { updateProductAction } from '../actions';

type VariantRow = {
  id: string;
  color: string;
  color_name: string;
  sizes: string[];
  stock: number | null;
  sort_order: number;
  images: { url: string; alt: string | null; type: string | null; sort_order: number; is_primary: boolean }[];
};

export default async function AdminProductEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('products')
    .select(
      '*, variants:product_variants(*, images:product_variant_images(*))'
    )
    .eq('id', id)
    .maybeSingle();
  if (error || !data) notFound();

  const raw = data as ProductRow & { variants: VariantRow[] };
  const sortedVariants = (raw.variants ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((v) => ({
      id: v.id,
      color: v.color,
      colorName: v.color_name,
      sizes: v.sizes,
      stock: v.stock,
      images: (v.images ?? [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((i) => ({
          url: i.url,
          alt: i.alt ?? undefined,
          type: i.type ?? undefined,
        })),
    }));

  const bound = updateProductAction.bind(null, id);
  const collections = COLLECTIONS.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <section className="flex max-w-5xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/admin/products"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/55 hover:text-or"
        >
          ← Produits
        </Link>
        <h1 className="font-serif text-3xl font-light text-ivoire md:text-4xl">
          Éditer un produit
        </h1>
      </header>
      <ProductForm
        action={bound}
        initial={{ ...raw, variants: sortedVariants }}
        collections={collections}
        submitLabel="Mettre à jour"
      />
    </section>
  );
}
