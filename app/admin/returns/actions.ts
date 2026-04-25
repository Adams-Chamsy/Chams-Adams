'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { ReturnStatus } from '@/lib/supabase/types';
import { sendReturnStatusEmail } from '@/lib/emails/sendBrandEmails';

const REASON_LABEL: Record<string, string> = {
  taille: 'taille incorrecte',
  qualite: 'qualité',
  'pas-conforme': 'non conforme à la description',
  'changement-avis': 'changement d’avis',
  defaut: 'défaut constaté',
  autre: 'autre',
};

export async function updateReturnStatusAction(
  id: string,
  status: ReturnStatus
) {
  const supabase = createSupabaseServiceClient();

  // Récupère email + reason avant l'update pour pouvoir notifier
  const { data: before } = await supabase
    .from('return_requests')
    .select('email, reason, status')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabase
    .from('return_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;

  // Email auto sur transitions notables (skip si statut inchangé)
  const NOTIFY_STATUSES: ReturnStatus[] = [
    'approved',
    'received',
    'refunded',
    'rejected',
  ];
  if (
    before?.email &&
    NOTIFY_STATUSES.includes(status) &&
    before.status !== status
  ) {
    sendReturnStatusEmail({
      to: before.email as string,
      status: status as 'approved' | 'received' | 'refunded' | 'rejected',
      reason: REASON_LABEL[before.reason as string] ?? (before.reason as string),
    }).catch((err) =>
      console.error('[returns] status email failed:', err)
    );
  }

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
