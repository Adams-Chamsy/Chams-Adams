import { createSupabaseServiceClient } from '@/lib/supabase/server';

const BUCKET = 'media';

/**
 * Upload un fichier dans le bucket public `media`.
 * Retourne l'URL publique définitive.
 */
export async function uploadMedia(
  file: File | Blob,
  filename: string,
  folder = 'uploads'
): Promise<{ url: string; path: string }> {
  const supabase = createSupabaseServiceClient();
  const safeName = filename.replace(/[^\w.\-]/g, '_');
  const path = `${folder}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteMedia(path: string) {
  const supabase = createSupabaseServiceClient();
  await supabase.storage.from(BUCKET).remove([path]);
}
