'use server';

import { revalidatePath } from 'next/cache';
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from '@/lib/supabase/server';
import { sendPieceTransferEmail } from '@/lib/emails/sendBrandEmails';

export type TransferResult = { ok: true } | { ok: false; error: string };

export async function transferPieceAction(
  pieceNumber: string,
  _prev: TransferResult | null,
  formData: FormData
): Promise<TransferResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) {
    return { ok: false, error: 'Connexion requise.' };
  }

  const newOwnerEmail = String(formData.get('new_owner_email') ?? '')
    .trim()
    .toLowerCase();
  const newOwnerName =
    ((formData.get('new_owner_name') as string | null) ?? '').trim() || null;
  const note = ((formData.get('note') as string | null) ?? '').trim() || null;

  if (!newOwnerEmail || !newOwnerEmail.includes('@')) {
    return { ok: false, error: 'Adresse de courriel invalide.' };
  }

  const service = createSupabaseServiceClient();
  const { data: piece } = await service
    .from('pieces')
    .select('id, piece_number, product_name')
    .eq('piece_number', pieceNumber)
    .or(`owner_user_id.eq.${user.id},owner_email.eq.${user.email}`)
    .maybeSingle();
  if (!piece) {
    return { ok: false, error: 'Pièce introuvable.' };
  }

  // Match auth.users si l'email correspond à un compte client
  let newUserId: string | null = null;
  try {
    const { data: list } = await service.auth.admin.listUsers();
    const match = list?.users.find(
      (u) => u.email?.toLowerCase() === newOwnerEmail
    );
    newUserId = match?.id ?? null;
  } catch {
    // ignore
  }

  // Update propriétaire
  const { error: updErr } = await service
    .from('pieces')
    .update({
      owner_email: newOwnerEmail,
      owner_user_id: newUserId,
      owner_name: newOwnerName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', piece.id as string);
  if (updErr) return { ok: false, error: 'Échec.' };

  // Événement
  await service.from('piece_events').insert({
    piece_id: piece.id as string,
    event_type: 'transmission',
    note: note ?? `Transmise à ${newOwnerEmail}`,
    transferred_from_email: user.email,
    transferred_to_email: newOwnerEmail,
  });

  // Email au nouveau propriétaire (best-effort)
  sendPieceTransferEmail({
    to: newOwnerEmail,
    pieceNumber: piece.piece_number as string,
    productName: piece.product_name as string,
    fromEmail: user.email,
    fromName: newOwnerName,
  }).catch((err) =>
    console.error('[piece transfer email]', err)
  );

  revalidatePath('/compte/pieces');
  revalidatePath(`/compte/pieces/${pieceNumber}`);
  return { ok: true };
}
