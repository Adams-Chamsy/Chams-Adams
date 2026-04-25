'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

export async function grantLoyaltyPointsAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const points = Number(formData.get('points'));
  const reason = (formData.get('reason') as string) || null;

  if (!email || !email.includes('@')) throw new Error('Email invalide.');
  if (!Number.isFinite(points) || points === 0) {
    throw new Error('Points invalides.');
  }

  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('loyalty_points').insert({
    email,
    points: Math.round(points),
    reason,
  });
  if (error) throw error;
  revalidatePath('/admin/loyalty');
}

export async function deleteLoyaltyEntryAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('loyalty_points')
    .delete()
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/loyalty');
}
