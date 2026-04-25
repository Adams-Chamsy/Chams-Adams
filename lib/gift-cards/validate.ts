import 'server-only';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { GiftCardRow } from '@/lib/supabase/types';

export type ValidatedGiftCard = {
  code: string;
  remaining_cents: number;
  applied_cents: number;
  card_id: string;
};

/**
 * Valide une carte cadeau côté serveur.
 *  - existe et active
 *  - non expirée
 *  - solde restant > 0
 *
 * Le montant appliqué est le min(solde, total panier).
 */
export async function validateGiftCard(
  code: string,
  cartTotalCents: number
): Promise<
  | { ok: true; card: ValidatedGiftCard }
  | { ok: false; error: string }
> {
  if (!code) return { ok: false, error: 'Code manquant.' };

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('gift_cards')
    .select('*')
    .eq('code', code.trim().toUpperCase())
    .maybeSingle();
  if (error || !data) return { ok: false, error: 'Carte introuvable.' };

  const card = data as GiftCardRow;
  if (!card.active) return { ok: false, error: 'Carte désactivée.' };
  if (card.expires_at && new Date(card.expires_at).getTime() < Date.now()) {
    return { ok: false, error: 'Carte expirée.' };
  }
  if (card.remaining_cents <= 0) {
    return { ok: false, error: 'Carte épuisée.' };
  }

  const applied = Math.min(card.remaining_cents, cartTotalCents);
  return {
    ok: true,
    card: {
      code: card.code,
      remaining_cents: card.remaining_cents,
      applied_cents: applied,
      card_id: card.id,
    },
  };
}

/** Décrémente le solde d'une carte cadeau après checkout réussi. */
export async function debitGiftCard(
  cardId: string,
  amountCents: number
): Promise<void> {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from('gift_cards')
    .select('remaining_cents')
    .eq('id', cardId)
    .maybeSingle();
  const remaining = (data?.remaining_cents as number | undefined) ?? 0;
  const next = Math.max(0, remaining - amountCents);
  await supabase
    .from('gift_cards')
    .update({
      remaining_cents: next,
      updated_at: new Date().toISOString(),
    })
    .eq('id', cardId);
}
