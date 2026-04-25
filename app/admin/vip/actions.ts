'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { VipTier } from '@/lib/supabase/types';

const TIERS: VipTier[] = ['silver', 'gold', 'platinum'];

function adv(formData: FormData, key: string): string | null {
  const v = (formData.get(key) as string | null)?.trim();
  return v && v.length > 0 ? v : null;
}

export async function createVipMemberAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const full_name = (formData.get('full_name') as string) || null;
  const tier = String(formData.get('tier') ?? 'silver') as VipTier;
  const invited_by = (formData.get('invited_by') as string) || null;
  const notes = (formData.get('notes') as string) || null;

  if (!email || !email.includes('@')) {
    throw new Error('Email invalide.');
  }
  if (!TIERS.includes(tier)) {
    throw new Error('Niveau invalide.');
  }

  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('vip_members').insert({
    email,
    full_name,
    tier,
    invited_by,
    notes,
    active: true,
    advisor_name: adv(formData, 'advisor_name'),
    advisor_role: adv(formData, 'advisor_role'),
    advisor_photo_url: adv(formData, 'advisor_photo_url'),
    advisor_email: adv(formData, 'advisor_email'),
    advisor_whatsapp: adv(formData, 'advisor_whatsapp'),
    advisor_cal_link: adv(formData, 'advisor_cal_link'),
  });
  if (error) throw error;

  revalidatePath('/admin/vip');
  redirect('/admin/vip');
}

export async function updateVipTierAction(id: string, tier: VipTier) {
  if (!TIERS.includes(tier)) throw new Error('Niveau invalide.');
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('vip_members')
    .update({ tier, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/vip');
}

export async function toggleVipActiveAction(id: string, active: boolean) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('vip_members')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/vip');
}

export async function deleteVipMemberAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('vip_members').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/vip');
}
