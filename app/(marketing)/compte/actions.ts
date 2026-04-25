'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type AuthResult = { ok: true } | { ok: false; error: string };

export async function customerLoginAction(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/compte');

  if (!email || !password) {
    return { ok: false, error: 'Adresse et mot de passe requis.' };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { ok: false, error: 'Identifiants invalides.' };
  }
  redirect(next);
}

export async function customerSignupAction(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const fullName = String(formData.get('full_name') ?? '').trim();

  if (!email || !password || password.length < 8) {
    return {
      ok: false,
      error: 'Adresse valide et mot de passe (8 caractères min) requis.',
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName || null },
    },
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  redirect('/compte');
}

export async function customerLogoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/');
}
