'use server';

import { redirect } from 'next/navigation';
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from '@/lib/supabase/server';

export type LoginResult =
  | { ok: true }
  | { ok: false; error: string };

export async function loginAction(
  _prev: LoginResult | null,
  formData: FormData
): Promise<LoginResult> {
  const email = (formData.get('email') as string | null)?.trim();
  const password = formData.get('password') as string | null;
  const next = (formData.get('next') as string | null) ?? '/admin';

  if (!email || !password) {
    return { ok: false, error: 'Email et mot de passe requis.' };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { ok: false, error: 'Identifiants invalides.' };
  }

  // Vérif rôle admin via service_role — évite les subtilités de timing
  // cookies + RLS récursive au moment immédiat du signIn.
  const serviceSupabase = createSupabaseServiceClient();
  const { data: adminRow } = await serviceSupabase
    .from('admin_users')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!adminRow || !['admin', 'editor'].includes(adminRow.role)) {
    await supabase.auth.signOut();
    return {
      ok: false,
      error: "Ce compte n'a pas accès à l'administration.",
    };
  }

  redirect(next);
}
