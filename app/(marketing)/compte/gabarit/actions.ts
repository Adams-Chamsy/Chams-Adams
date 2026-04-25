'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type GabaritResult = { ok: true } | { ok: false; error: string };

function num(formData: FormData, key: string): number | null {
  const raw = formData.get(key);
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function saveGabaritAction(
  _prev: GabaritResult | null,
  formData: FormData
): Promise<GabaritResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: 'Connexion requise.' };
  }

  const payload = {
    user_id: user.id,
    poitrine_cm: num(formData, 'poitrine_cm'),
    taille_cm: num(formData, 'taille_cm'),
    hanches_cm: num(formData, 'hanches_cm'),
    longueur_bras_cm: num(formData, 'longueur_bras_cm'),
    longueur_jambe_cm: num(formData, 'longueur_jambe_cm'),
    hauteur_epaule_cm: num(formData, 'hauteur_epaule_cm'),
    hauteur_totale_cm: num(formData, 'hauteur_totale_cm'),
    taille_preferee:
      ((formData.get('taille_preferee') as string | null) ?? '').trim() || null,
    notes: ((formData.get('notes') as string | null) ?? '').trim() || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('customer_measurements')
    .upsert(payload, { onConflict: 'user_id' });
  if (error) {
    console.error('[gabarit]', error);
    return { ok: false, error: 'Échec de l\u2019enregistrement.' };
  }

  revalidatePath('/compte/gabarit');
  revalidatePath('/sur-mesure');
  return { ok: true };
}
