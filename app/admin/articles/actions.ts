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

function parse(formData: FormData) {
  const title = ((formData.get('title') as string | null) ?? '').trim();
  const slugInput = ((formData.get('slug') as string | null) ?? '').trim();
  const slug = slugInput || slugify(title);
  const bodyJsonRaw = (formData.get('body_json') as string | null) ?? '';
  let body_json: unknown = {};
  try {
    body_json = bodyJsonRaw ? JSON.parse(bodyJsonRaw) : {};
  } catch {
    body_json = {};
  }
  const published = (formData.get('published') as string | null) === 'on';
  return {
    title,
    slug,
    category: ((formData.get('category') as string | null) ?? '').trim() || null,
    excerpt: ((formData.get('excerpt') as string | null) ?? '').trim() || null,
    cover_image_url:
      ((formData.get('cover_image_url') as string | null) ?? '').trim() || null,
    cover_image_alt:
      ((formData.get('cover_image_alt') as string | null) ?? '').trim() || null,
    body_json,
    reading_time:
      Number((formData.get('reading_time') as string | null) ?? '5') || 5,
    published,
    published_at: published ? new Date().toISOString() : null,
  };
}

export async function createArticleAction(formData: FormData) {
  const values = parse(formData);
  if (!values.title || !values.slug) {
    throw new Error('Titre obligatoire.');
  }
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('articles').insert(values);
  if (error) throw error;
  revalidatePath('/admin/articles');
  revalidatePath('/journal');
  revalidatePath(`/journal/${values.slug}`);
  revalidateTag('articles');
  redirect('/admin/articles');
}

export async function updateArticleAction(id: string, formData: FormData) {
  const values = parse(formData);
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('articles')
    .update(values)
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/articles');
  revalidatePath('/journal');
  revalidatePath(`/journal/${values.slug}`);
  revalidateTag('articles');
  redirect('/admin/articles');
}

export async function deleteArticleAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/articles');
  revalidatePath('/journal');
  revalidateTag('articles');
}
