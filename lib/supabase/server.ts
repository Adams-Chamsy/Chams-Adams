import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createSbClient } from '@supabase/supabase-js';

/**
 * Client Supabase server — respecte les cookies de session Supabase pour
 * que RLS s'applique avec la session courante. À utiliser dans les Server
 * Components et Server Actions.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options: CookieOptions }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components ne peuvent pas set des cookies — on no-op
            // (le middleware le fera).
          }
        },
      },
    }
  );
}

/**
 * Client avec service_role — bypass RLS. À n'utiliser QUE dans des contextes
 * serveur où l'autorisation est gérée manuellement (ex: webhook Stripe).
 */
export function createSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY manquante — requise pour les opérations privilégiées.'
    );
  }
  return createSbClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Indique si Supabase est configuré (sinon fallback mock). */
export function isSupabaseEnabled(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
