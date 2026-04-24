'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const CATEGORIES = [
  'livraison',
  'sur-mesure',
  'entretien',
  'paiement',
  'retours',
  'atelier',
] as const;

type Category = (typeof CATEGORIES)[number];

function parseFormData(formData: FormData) {
  const categoryRaw = (formData.get('category') as string | null) ?? '';
  const category = CATEGORIES.includes(categoryRaw as Category)
    ? (categoryRaw as Category)
    : 'livraison';

  return {
    category,
    question: ((formData.get('question') as string | null) ?? '').trim(),
    answer: ((formData.get('answer') as string | null) ?? '').trim(),
    sort_order: Number((formData.get('sort_order') as string | null) ?? 0) || 0,
    published: (formData.get('published') as string | null) === 'on',
  };
}

export async function createFaqAction(formData: FormData) {
  const values = parseFormData(formData);
  if (!values.question || !values.answer) {
    throw new Error('Question et réponse obligatoires.');
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('faq_items').insert(values);
  if (error) throw error;

  revalidatePath('/admin/faq');
  revalidatePath('/faq');
  revalidateTag('faq');
  redirect('/admin/faq');
}

export async function updateFaqAction(id: string, formData: FormData) {
  const values = parseFormData(formData);
  if (!values.question || !values.answer) {
    throw new Error('Question et réponse obligatoires.');
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('faq_items')
    .update(values)
    .eq('id', id);
  if (error) throw error;

  revalidatePath('/admin/faq');
  revalidatePath('/faq');
  revalidateTag('faq');
  redirect('/admin/faq');
}

export async function deleteFaqAction(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('faq_items').delete().eq('id', id);
  if (error) throw error;

  revalidatePath('/admin/faq');
  revalidatePath('/faq');
  revalidateTag('faq');
}
