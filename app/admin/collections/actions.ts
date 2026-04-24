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
    .slice(0, 80);
}

function parse(formData: FormData) {
  const name = ((formData.get('name') as string | null) ?? '').trim();
  const slugInput = ((formData.get('slug') as string | null) ?? '').trim();
  const slug = slugInput || slugify(name);
  return {
    name,
    slug,
    tagline: ((formData.get('tagline') as string | null) ?? '').trim() || null,
    description: ((formData.get('description') as string | null) ?? '').trim() || null,
    long_description:
      ((formData.get('long_description') as string | null) ?? '').trim() || null,
    hero_image_url:
      ((formData.get('hero_image_url') as string | null) ?? '').trim() || null,
    hero_image_alt:
      ((formData.get('hero_image_alt') as string | null) ?? '').trim() || null,
    sort_order: Number((formData.get('sort_order') as string | null) ?? 0) || 0,
  };
}

export async function createCollectionAction(formData: FormData) {
  const values = parse(formData);
  if (!values.name || !values.slug) throw new Error('Nom obligatoire.');
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('collections').insert(values);
  if (error) throw error;
  revalidatePath('/admin/collections');
  revalidatePath('/collections');
  revalidateTag('collections');
  redirect('/admin/collections');
}

export async function updateCollectionAction(id: string, formData: FormData) {
  const values = parse(formData);
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('collections')
    .update(values)
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/collections');
  revalidatePath('/collections');
  revalidatePath(`/collections/${values.slug}`);
  revalidateTag('collections');
  redirect('/admin/collections');
}

export async function deleteCollectionAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('collections').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/collections');
  revalidatePath('/collections');
  revalidateTag('collections');
}
