'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const blocks = Array.from({ length: 4 }, () =>
    Array.from({ length: 4 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('')
  );
  return `CA-${blocks.join('-')}`;
}

export async function createGiftCardAction(formData: FormData) {
  const amount = Number(formData.get('amount'));
  const recipient_name = (formData.get('recipient_name') as string) || null;
  const recipient_email = (formData.get('recipient_email') as string) || null;
  const sender_name = (formData.get('sender_name') as string) || null;
  const message = (formData.get('message') as string) || null;
  const expires_at = (formData.get('expires_at') as string) || null;

  if (!amount || amount < 10 || amount > 5000) {
    throw new Error('Montant invalide (10–5000 €).');
  }
  const cents = Math.round(amount * 100);

  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('gift_cards').insert({
    code: generateCode(),
    initial_amount_cents: cents,
    remaining_cents: cents,
    currency: 'EUR',
    recipient_name,
    recipient_email,
    sender_name,
    message,
    expires_at,
    active: true,
  });
  if (error) throw error;

  revalidatePath('/admin/gift-cards');
  redirect('/admin/gift-cards');
}

export async function toggleGiftCardActiveAction(id: string, active: boolean) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('gift_cards')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/gift-cards');
}

export async function deleteGiftCardAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('gift_cards').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/gift-cards');
}
