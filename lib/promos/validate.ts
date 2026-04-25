import 'server-only';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { PromoCodeRow } from '@/lib/supabase/types';

export type ValidatedPromo = {
  code: string;
  discount_cents: number;
  promo_id: string;
};

/**
 * Valide un code promo côté serveur :
 *  - existe et actif
 *  - dans la fenêtre de validité
 *  - panier ≥ min_amount
 *  - utilisations restantes
 *
 * Retourne la réduction calculée en cents.
 */
export async function validatePromoCode(
  code: string,
  cartTotalCents: number
): Promise<{ ok: true; promo: ValidatedPromo } | { ok: false; error: string }> {
  if (!code) return { ok: false, error: 'Code manquant.' };
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', code.trim().toUpperCase())
    .maybeSingle();
  if (error || !data) return { ok: false, error: 'Code invalide.' };

  const promo = data as PromoCodeRow;
  if (!promo.active) return { ok: false, error: 'Code désactivé.' };

  const now = Date.now();
  if (new Date(promo.starts_at).getTime() > now) {
    return { ok: false, error: "Code pas encore valide." };
  }
  if (promo.ends_at && new Date(promo.ends_at).getTime() < now) {
    return { ok: false, error: 'Code expiré.' };
  }
  if (promo.max_uses && promo.uses_count >= promo.max_uses) {
    return { ok: false, error: 'Code épuisé.' };
  }
  if (cartTotalCents < promo.min_amount_cents) {
    const min = (promo.min_amount_cents / 100).toFixed(0);
    return { ok: false, error: `Minimum ${min} € requis pour ce code.` };
  }

  const discount =
    promo.discount_type === 'percent'
      ? Math.round((cartTotalCents * promo.discount_value) / 100)
      : Math.min(promo.discount_value, cartTotalCents);

  return {
    ok: true,
    promo: { code: promo.code, discount_cents: discount, promo_id: promo.id },
  };
}

/** Incrémente le compteur d'utilisation après checkout réussi. */
export async function recordPromoUse(promoId: string): Promise<void> {
  const supabase = createSupabaseServiceClient();
  await supabase.rpc('increment_promo_uses', { p_id: promoId }).then(
    () => {},
    async () => {
      // Fallback raw update si la RPC n'existe pas encore
      const { data } = await supabase
        .from('promo_codes')
        .select('uses_count')
        .eq('id', promoId)
        .maybeSingle();
      const current = (data?.uses_count as number | undefined) ?? 0;
      await supabase
        .from('promo_codes')
        .update({ uses_count: current + 1 })
        .eq('id', promoId);
    }
  );
}
