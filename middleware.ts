import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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

  // Vérification du rôle admin
  const { data: adminRow } = await supabase
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

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
