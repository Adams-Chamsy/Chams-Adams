import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

/**
 * Middleware d'authentification admin.
 *
 * - Refresh token Supabase sur chaque requête
 * - Protège les routes /admin/* : redirige vers /admin/login si pas connecté
 *   ou pas dans admin_users
 * - Laisse passer /admin/login publiquement
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Routes publiques même sous /admin
  if (pathname === '/admin/login' || pathname.startsWith('/admin/api/')) {
    return NextResponse.next();
  }

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    // Supabase pas encore configuré — on laisse passer (dev mode)
    return NextResponse.next();
  }

  let res = NextResponse.next({ request: req });

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        cookiesToSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Vérification du rôle admin via service_role (bypass RLS —
  // évite les subtilités de policies récursives sur admin_users)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    const adminClient = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: adminRow } = await adminClient
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (!adminRow || !['admin', 'editor'].includes(adminRow.role)) {
      const forbiddenUrl = req.nextUrl.clone();
      forbiddenUrl.pathname = '/admin/login';
      forbiddenUrl.searchParams.set('error', 'forbidden');
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
