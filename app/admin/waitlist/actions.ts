'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { sendRestockEmail } from '@/lib/emails/sendBrandEmails';

export async function markNotifiedAction(id: string) {
  const supabase = createSupabaseServiceClient();

  // Récupère l'entrée + nom du produit pour l'email
  const { data: entry } = await supabase
    .from('waitlist_entries')
    .select('email, product_slug, size, product:products(name)')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabase
    .from('waitlist_entries')
    .update({ notified_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;

  if (entry?.email && entry.product_slug) {
    const productName =
      (entry as { product?: { name?: string } | null }).product?.name ??
      entry.product_slug;
    sendRestockEmail({
      to: entry.email as string,
      productName,
      productSlug: entry.product_slug as string,
      size: (entry.size as string | null) ?? null,
    }).catch((err) =>
      console.error('[waitlist] restock email failed:', err)
    );
  }

  revalidatePath('/admin/waitlist');
}

export async function deleteWaitlistEntryAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('waitlist_entries').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/waitlist');
}
