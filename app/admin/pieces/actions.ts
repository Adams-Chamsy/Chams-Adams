'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

function str(formData: FormData, key: string): string | null {
  const v = (formData.get(key) as string | null)?.trim();
  return v && v.length > 0 ? v : null;
}

function int(formData: FormData, key: string): number | null {
  const v = formData.get(key);
  if (v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : null;
}

export async function updatePieceAction(id: string, formData: FormData) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('pieces')
    .update({
      artisan_name: str(formData, 'artisan_name'),
      artisan_role: str(formData, 'artisan_role'),
      artisan_signature_url: str(formData, 'artisan_signature_url'),
      fabric_lot: str(formData, 'fabric_lot'),
      fabric_origin: str(formData, 'fabric_origin'),
      embroidery_hours: int(formData, 'embroidery_hours'),
      completed_at: str(formData, 'completed_at'),
      certificate_published:
        (formData.get('certificate_published') as string | null) === 'on',
      notes: str(formData, 'notes'),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/pieces');
  revalidatePath(`/admin/pieces/${id}`);
}

export async function addPieceEventAction(pieceId: string, formData: FormData) {
  const event_type = String(formData.get('event_type') ?? '');
  const occurred_at =
    (formData.get('occurred_at') as string) ||
    new Date().toISOString().slice(0, 10);
  const note = str(formData, 'note');
  if (
    !['retouche', 'entretien', 'transmission', 'note'].includes(event_type)
  ) {
    throw new Error('Type invalide.');
  }
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from('piece_events').insert({
    piece_id: pieceId,
    event_type,
    occurred_at,
    note,
  });
  if (error) throw error;
  revalidatePath(`/admin/pieces/${pieceId}`);
  revalidatePath(`/compte/pieces`);
}
