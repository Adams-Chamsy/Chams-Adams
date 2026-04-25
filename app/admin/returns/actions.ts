'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { ReturnStatus } from '@/lib/supabase/types';

export async function updateReturnStatusAction(
  id: string,
  status: ReturnStatus
) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('return_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/returns');
}

export async function deleteReturnAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('return_requests')
    .delete()
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/returns');
}
