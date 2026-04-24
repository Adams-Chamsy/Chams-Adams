'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

function parse(formData: FormData) {
  return {
    publication: ((formData.get('publication') as string | null) ?? '').trim(),
    logo_text: ((formData.get('logo_text') as string | null) ?? '').trim() || null,
    published_at: (formData.get('published_at') as string | null) || null,
    title: ((formData.get('title') as string | null) ?? '').trim(),
    excerpt: ((formData.get('excerpt') as string | null) ?? '').trim() || null,
    article_url: ((formData.get('article_url') as string | null) ?? '').trim() || null,
    featured: (formData.get('featured') as string | null) === 'on',
  };
}

export async function createPressAction(formData: FormData) {
  const values = parse(formData);
  if (!values.publication || !values.title || !values.published_at) {
    throw new Error('Publication, titre et date obligatoires.');
  }
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('press_entries').insert(values);
  if (error) throw error;
  revalidatePath('/admin/press');
  revalidatePath('/presse');
  revalidateTag('press');
  redirect('/admin/press');
}

export async function updatePressAction(id: string, formData: FormData) {
  const values = parse(formData);
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('press_entries').update(values).eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/press');
  revalidatePath('/presse');
  revalidateTag('press');
  redirect('/admin/press');
}

export async function deletePressAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('press_entries').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/press');
  revalidatePath('/presse');
  revalidateTag('press');
}
