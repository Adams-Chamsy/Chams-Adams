'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

const TYPES = ['defile', 'showroom', 'ceremonie', 'presse', 'collection'] as const;

function parse(formData: FormData) {
  const typeRaw = (formData.get('type') as string | null) ?? '';
  const type = TYPES.includes(typeRaw as (typeof TYPES)[number])
    ? (typeRaw as (typeof TYPES)[number])
    : 'ceremonie';

  const cta_label = ((formData.get('cta_label') as string | null) ?? '').trim();
  const cta_href = ((formData.get('cta_href') as string | null) ?? '').trim();

  return {
    title: ((formData.get('title') as string | null) ?? '').trim(),
    type,
    start_date: (formData.get('start_date') as string | null) || null,
    end_date: ((formData.get('end_date') as string | null) || null) || null,
    location: ((formData.get('location') as string | null) ?? '').trim() || null,
    city: ((formData.get('city') as string | null) ?? '').trim() || null,
    country: ((formData.get('country') as string | null) ?? '').trim() || null,
    description: ((formData.get('description') as string | null) ?? '').trim(),
    cta: cta_label && cta_href ? { label: cta_label, href: cta_href } : null,
    published: (formData.get('published') as string | null) === 'on',
  };
}

export async function createEventAction(formData: FormData) {
  const values = parse(formData);
  if (!values.title || !values.description || !values.start_date) {
    throw new Error('Titre, description et date de début obligatoires.');
  }
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('events').insert(values);
  if (error) throw error;
  revalidatePath('/admin/events');
  revalidatePath('/evenements');
  revalidateTag('events');
  redirect('/admin/events');
}

export async function updateEventAction(id: string, formData: FormData) {
  const values = parse(formData);
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('events').update(values).eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/events');
  revalidatePath('/evenements');
  revalidateTag('events');
  redirect('/admin/events');
}

export async function deleteEventAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/events');
  revalidatePath('/evenements');
  revalidateTag('events');
}
