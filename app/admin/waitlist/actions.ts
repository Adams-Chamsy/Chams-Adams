'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

export async function markNotifiedAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('waitlist_entries')
    .update({ notified_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/waitlist');
}

export async function deleteWaitlistEntryAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('waitlist_entries').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/waitlist');
}
