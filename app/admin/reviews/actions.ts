'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

export async function approveReviewAction(id: string, slug: string | null) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('product_reviews')
    .update({ approved: true })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/reviews');
  if (slug) revalidatePath(`/produit/${slug}`);
}

export async function rejectReviewAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('product_reviews')
    .update({ approved: false })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/reviews');
}

export async function deleteReviewAction(id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('product_reviews').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/reviews');
}

export async function toggleVerifiedBuyerAction(id: string, current: boolean) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('product_reviews')
    .update({ verified_buyer: !current })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/reviews');
}
