import Link from 'next/link';
import { LogOut, ExternalLink } from 'lucide-react';
import { createSupabaseServerClient, isSupabaseEnabled } from '@/lib/supabase/server';
import { AdminNav } from '@/components/admin/AdminNav';
import { logoutAction } from './actions';

/**
 * Layout des routes /admin/*.
 *
 * Comportement :
 * - Auth-gating géré par le middleware (redirige vers /admin/login si pas
 *   de session / pas de rôle admin).
 * - Si pas de user (cas légitime : /admin/login lui-même qui est public),
 *   on rend les enfants SANS le shell — la page de connexion s'affiche
 *   alors propre, sans sidebar ni "Déconnexion".
 * - Si user connecté → shell complet avec sidebar, nav structurée et
 *   actions de pied.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | null = null;
  if (isSupabaseEnabled()) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userEmail = user?.email ?? null;
    } catch {
      // dev fallback
    }
  }

  // Pas de session : rendu nu, pas de shell admin.
  // (la page /admin/login pourra s'afficher proprement ; les autres routes
  // ont déjà été redirigées par le middleware avant d'arriver ici.)
  if (!userEmail) {
    return (
      <div className="relative z-[100] min-h-screen bg-[#0F0E0C] text-ivoire">
        {children}
      </div>
    );
  }

  return (
    <div className="relative z-[100] min-h-screen bg-[#0F0E0C] text-ivoire">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="flex flex-col border-r border-bronze/20 bg-noir md:sticky md:top-0 md:h-screen">
          {/* En-tête de la sidebar */}
          <div className="shrink-0 px-6 pt-6 pb-4">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-or">
              Administration
            </span>
            <h2 className="mt-1 font-serif text-xl font-light text-ivoire">
              Chams Adams
            </h2>
            <p className="mt-2 truncate font-sans text-xs italic text-ivoire/50">
              {userEmail}
            </p>
          </div>

          {/* Nav scrollable au milieu — flex-1 prend tout l'espace */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <AdminNav />
          </div>

          {/* Pied : actions toujours visibles */}
          <div className="shrink-0 border-t border-bronze/20 px-6 py-5">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-ivoire/60 hover:text-or"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Voir le site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-ivoire/80 hover:text-or"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Déconnexion
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
