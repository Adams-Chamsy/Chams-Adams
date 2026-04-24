import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { uploadMedia } from '@/lib/supabase/storage';

/**
 * POST /admin/api/upload — upload un fichier dans le bucket `media`.
 * Réservé aux admins (check admin_users via la session cookie).
 */
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string | null) ?? 'uploads';
  if (!file) return NextResponse.json({ error: 'no file' }, { status: 400 });

  try {
    const { url, path } = await uploadMedia(file, file.name, folder);
    return NextResponse.json({ url, path });
  } catch (err) {
    console.error('[upload]', err);
    return NextResponse.json({ error: 'upload failed' }, { status: 500 });
  }
}
