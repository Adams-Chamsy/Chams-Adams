'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { EventType } from '@/lib/supabase/types';

const TYPES: EventType[] = [
  'mariage',
  'tabaski',
  'magal',
  'maouloud',
  'bapteme',
  'ceremonie',
  'autre',
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

export async function createCarnetAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Connexion requise.');

  const event_name = String(formData.get('event_name') ?? '').trim();
  if (!event_name) throw new Error('Nom de l\u2019événement requis.');

  const event_type = String(formData.get('event_type') ?? 'ceremonie') as EventType;
  if (!TYPES.includes(event_type)) throw new Error('Type invalide.');

  const event_date_raw = (formData.get('event_date') as string) || null;
  const honoree_name = (formData.get('honoree_name') as string) || null;
  const message = (formData.get('message') as string) || null;
  const cover_image_url = (formData.get('cover_image_url') as string) || null;

  // Slug unique : <slug>-<short-id>
  const baseSlug = slugify(event_name);
  const suffix = Math.random().toString(36).slice(2, 8);
  const slug = `${baseSlug}-${suffix}`;

  const { error } = await supabase.from('event_carnets').insert({
    user_id: user.id,
    slug,
    event_name,
    event_type,
    event_date: event_date_raw,
    honoree_name,
    message,
    cover_image_url,
    is_public: true,
  });
  if (error) throw error;

  revalidatePath('/compte/carnets');
  redirect(`/compte/carnets/${slug}`);
}

export async function deleteCarnetAction(slug: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Connexion requise.');

  const { error } = await supabase
    .from('event_carnets')
    .delete()
    .eq('slug', slug)
    .eq('user_id', user.id);
  if (error) throw error;
  revalidatePath('/compte/carnets');
}

export async function addCarnetItemAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Connexion requise.');

  const carnet_slug = String(formData.get('carnet_slug') ?? '');
  const product_slug = String(formData.get('product_slug') ?? '').trim();
  if (!carnet_slug || !product_slug) throw new Error('Données invalides.');

  const { data: carnet } = await supabase
    .from('event_carnets')
    .select('id')
    .eq('slug', carnet_slug)
    .eq('user_id', user.id)
    .maybeSingle();
  if (!carnet) throw new Error('Carnet introuvable.');

  const { data: product } = await supabase
    .from('products')
    .select('id')
    .eq('slug', product_slug)
    .maybeSingle();

  await supabase.from('event_carnet_items').upsert(
    {
      carnet_id: carnet.id as string,
      product_id: (product?.id as string | undefined) ?? null,
      product_slug,
    },
    { onConflict: 'carnet_id,product_slug', ignoreDuplicates: true }
  );

  revalidatePath(`/compte/carnets/${carnet_slug}`);
}

export async function createCarnetFromWishlistAction(input: {
  event_name: string;
  event_type: EventType;
  event_date?: string | null;
  product_slugs: string[];
}): Promise<{ ok: true; slug: string } | { ok: false; error: string }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Connexion requise.' };

  const event_name = input.event_name.trim();
  if (!event_name) return { ok: false, error: 'Nom requis.' };
  if (!TYPES.includes(input.event_type)) {
    return { ok: false, error: 'Type invalide.' };
  }

  const baseSlug = slugify(event_name);
  const suffix = Math.random().toString(36).slice(2, 8);
  const slug = `${baseSlug}-${suffix}`;

  const { data: carnet, error: cErr } = await supabase
    .from('event_carnets')
    .insert({
      user_id: user.id,
      slug,
      event_name,
      event_type: input.event_type,
      event_date: input.event_date ?? null,
      is_public: true,
    })
    .select('id')
    .single();
  if (cErr || !carnet) {
    console.error('[carnets/from-wishlist]', cErr);
    return { ok: false, error: 'Échec.' };
  }

  const productSlugs = input.product_slugs.slice(0, 50);
  if (productSlugs.length > 0) {
    const { data: products } = await supabase
      .from('products')
      .select('id, slug')
      .in('slug', productSlugs);
    const productMap = new Map(
      (products ?? []).map((p) => [p.slug as string, p.id as string])
    );
    const rows = productSlugs.map((s) => ({
      carnet_id: carnet.id as string,
      product_id: productMap.get(s) ?? null,
      product_slug: s,
    }));
    await supabase.from('event_carnet_items').upsert(rows, {
      onConflict: 'carnet_id,product_slug',
      ignoreDuplicates: true,
    });
  }

  revalidatePath('/compte/carnets');
  return { ok: true, slug };
}

export async function removeCarnetItemAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Connexion requise.');

  const carnet_slug = String(formData.get('carnet_slug') ?? '');
  const product_slug = String(formData.get('product_slug') ?? '');

  const { data: carnet } = await supabase
    .from('event_carnets')
    .select('id')
    .eq('slug', carnet_slug)
    .eq('user_id', user.id)
    .maybeSingle();
  if (!carnet) return;

  await supabase
    .from('event_carnet_items')
    .delete()
    .eq('carnet_id', carnet.id as string)
    .eq('product_slug', product_slug);

  revalidatePath(`/compte/carnets/${carnet_slug}`);
}
