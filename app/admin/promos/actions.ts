'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

function parse(formData: FormData) {
  const code = ((formData.get('code') as string | null) ?? '').trim().toUpperCase();
  const discountTypeRaw = (formData.get('discount_type') as string | null) ?? 'percent';
  const discount_type = discountTypeRaw === 'fixed' ? 'fixed' : 'percent';
  const discountValueRaw = Number(formData.get('discount_value') as string | null);
  // percent stocke 10 pour 10% ; fixed stocke en cents
  const discount_value =
    discount_type === 'fixed'
      ? Math.round((discountValueRaw || 0) * 100)
      : Math.round(discountValueRaw || 0);
  return {
    code,
    label: ((formData.get('label') as string | null) ?? '').trim() || null,
    discount_type,
    discount_value,
    min_amount_cents: Math.round(
      Number(formData.get('min_amount') as string | null) * 100 || 0
    ),
    max_uses: formData.get('max_uses')
      ? Number(formData.get('max_uses') as string)
      : null,
    starts_at: (formData.get('starts_at') as string | null) || new Date().toISOString(),
    ends_at: (formData.get('ends_at') as string | null) || null,
    active: (formData.get('active') as string | null) === 'on',
  };
}

export async function createPromoAction(formData: FormData) {
  const values = parse(formData);
  if (!values.code || !values.discount_value) {
    throw new Error('Code et valeur obligatoires.');
  }
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('promo_codes').insert(values);
  if (error) throw error;
  revalidatePath('/admin/promos');
  redirect('/admin/promos');
}

export async function updatePromoAction(id: string, formData: FormData) {
  const values = parse(formData);
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('promo_codes').update(values).eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/promos');
  redirect('/admin/promos');
}

export async function deletePromoAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('promo_codes').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/promos');
}
