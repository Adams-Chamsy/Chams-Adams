'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

const STATUSES = [
  'pending',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const;

export async function updateOrderStatusAction(id: string, formData: FormData) {
  const statusRaw = (formData.get('status') as string | null) ?? '';
  if (!STATUSES.includes(statusRaw as (typeof STATUSES)[number])) {
    throw new Error('Statut invalide.');
  }
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('orders')
    .update({ status: statusRaw })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
}
