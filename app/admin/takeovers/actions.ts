'use server';

import { revalidatePath } from 'next/cache';
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
    .slice(0, 80);
}

function parseSlugList(raw: string | null): string[] {
  return (raw ?? '')
    .split(/[,\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createTakeoverAction(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  const event_type = String(formData.get('event_type') ?? '').trim();
  const event_date = (formData.get('event_date') as string) || null;
  if (!title || !event_type || !event_date) {
    throw new Error('Titre, type et date requis.');
  }

  const slugRaw = String(formData.get('slug') ?? '').trim();
  const slug = slugRaw || slugify(title);

  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('seasonal_takeovers').insert({
    slug,
    title,
    event_type,
    event_date,
    hero_eyebrow: (formData.get('hero_eyebrow') as string) || null,
    hero_subtitle: (formData.get('hero_subtitle') as string) || null,
    hero_image_url: (formData.get('hero_image_url') as string) || null,
    description: (formData.get('description') as string) || null,
    curated_product_slugs: parseSlugList(
      formData.get('curated_product_slugs') as string | null
    ),
    delivery_deadline:
      (formData.get('delivery_deadline') as string) || null,
    cta_label:
      (formData.get('cta_label') as string) || 'Découvrir la sélection',
    published: (formData.get('published') as string | null) === 'on',
  });
  if (error) throw error;

  revalidatePath('/admin/takeovers');
  redirect('/admin/takeovers');
}

export async function deleteTakeoverAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('seasonal_takeovers')
    .delete()
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/takeovers');
}

export async function togglePublishedAction(id: string, published: boolean) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('seasonal_takeovers')
    .update({ published, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/takeovers');
}
