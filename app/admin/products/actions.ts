'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 96);
}

type VariantInput = {
  id?: string;
  color: string;
  colorName: string;
  sizes: string[];
  stock?: number | null;
  images: { url: string; alt?: string; type?: string; sort_order?: number; is_primary?: boolean }[];
};

function parseMain(formData: FormData) {
  const title = ((formData.get('name') as string | null) ?? '').trim();
  const slugInput = ((formData.get('slug') as string | null) ?? '').trim();
  const slug = slugInput || slugify(title);
  const priceRaw = (formData.get('price_amount') as string | null) ?? '0';
  const priceAmount = Math.round(Number(priceRaw) * 100) || 0;
  return {
    slug,
    name: title,
    subtitle: ((formData.get('subtitle') as string | null) ?? '').trim() || null,
    description: ((formData.get('description') as string | null) ?? '').trim(),
    long_description:
      ((formData.get('long_description') as string | null) ?? '').trim() || null,
    price_amount: priceAmount, // en cents
    price_currency: ((formData.get('price_currency') as string | null) ?? 'EUR').trim(),
    category_slug: ((formData.get('category_slug') as string | null) ?? '').trim(),
    materials: ((formData.get('materials') as string | null) ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    tags: ((formData.get('tags') as string | null) ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    care_pictos: ((formData.get('care_pictos') as string | null) ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    is_signature: (formData.get('is_signature') as string | null) === 'on',
    is_new: (formData.get('is_new') as string | null) === 'on',
    published: (formData.get('published') as string | null) === 'on',
    published_at: (formData.get('published') as string | null) === 'on' ? new Date().toISOString() : null,
    details: {
      craftingTime: ((formData.get('crafting_time') as string | null) ?? '').trim() || undefined,
      embroidery: ((formData.get('embroidery') as string | null) ?? '').trim() || undefined,
      origin: ((formData.get('origin') as string | null) ?? '').trim() || undefined,
      care: ((formData.get('care') as string | null) ?? '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean),
    },
  };
}

function parseVariants(formData: FormData): VariantInput[] {
  const raw = (formData.get('variants_json') as string | null) ?? '[]';
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as VariantInput[]) : [];
  } catch {
    return [];
  }
}

async function syncVariants(productId: string, variants: VariantInput[]) {
  const supabase = createSupabaseServiceClient();

  // Stratégie simple : on supprime puis on recrée (variants + images).
  // L'ordre matters — on_delete cascade depuis products→variants→images.
  await supabase.from('product_variants').delete().eq('product_id', productId);

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i]!;
    const { data: variantRow, error: vErr } = await supabase
      .from('product_variants')
      .insert({
        product_id: productId,
        color: v.color,
        color_name: v.colorName,
        sizes: v.sizes ?? [],
        stock: v.stock ?? null,
        sort_order: i,
      })
      .select('id')
      .single();
    if (vErr || !variantRow) throw vErr ?? new Error('variant insert failed');

    if (v.images.length > 0) {
      const imageRows = v.images.map((img, imgIdx) => ({
        variant_id: variantRow.id,
        url: img.url,
        alt: img.alt ?? '',
        type: img.type ?? 'flat',
        sort_order: imgIdx,
        is_primary: imgIdx === 0,
      }));
      const { error: iErr } = await supabase
        .from('product_variant_images')
        .insert(imageRows);
      if (iErr) throw iErr;
    }
  }
}

export async function createProductAction(formData: FormData) {
  const main = parseMain(formData);
  const variants = parseVariants(formData);
  if (!main.name || !main.description || !main.category_slug) {
    throw new Error('Nom, description et catégorie obligatoires.');
  }
  if (variants.length === 0) {
    throw new Error('Au moins une variante est requise.');
  }

  const supabase = createSupabaseServiceClient();
  const { data: product, error } = await supabase
    .from('products')
    .insert(main)
    .select('id, slug')
    .single();
  if (error || !product) throw error ?? new Error('product insert failed');

  await syncVariants(product.id, variants);

  revalidatePath('/admin/products');
  revalidatePath('/boutique');
  revalidatePath(`/produit/${product.slug}`);
  revalidateTag('products');
  redirect('/admin/products');
}

export async function updateProductAction(id: string, formData: FormData) {
  const main = parseMain(formData);
  const variants = parseVariants(formData);

  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('products').update(main).eq('id', id);
  if (error) throw error;

  await syncVariants(id, variants);

  revalidatePath('/admin/products');
  revalidatePath('/boutique');
  revalidatePath(`/produit/${main.slug}`);
  revalidateTag('products');
  redirect('/admin/products');
}

export async function deleteProductAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/products');
  revalidatePath('/boutique');
  revalidateTag('products');
}
