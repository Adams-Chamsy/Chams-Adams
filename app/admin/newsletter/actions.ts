'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

export async function unsubscribeAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/newsletter');
}

export async function resubscribeAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ unsubscribed_at: null })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/newsletter');
}

export async function deleteSubscriberAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('newsletter_subscribers')
    .delete()
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/newsletter');
}
