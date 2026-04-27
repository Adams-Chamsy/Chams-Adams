import { redirect } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createSupabaseServerClient, isSupabaseEnabled } from '@/lib/supabase/server';
import { AdminNav } from '@/components/admin/AdminNav';
import { logoutAction } from './actions';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail = '—';
  if (isSupabaseEnabled()) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) redirect('/admin/login');
      userEmail = user.email ?? '—';
    } catch {
      // dev fallback
    }
  }

  return (
    <div className="relative z-[100] min-h-screen bg-[#0F0E0C] text-ivoire">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="border-r border-bronze/20 bg-noir p-6 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
          <div className="mb-8 flex flex-col gap-1">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-or">
              Administration
            </span>
            <h2 className="font-serif text-xl font-light text-ivoire">
              Chams Adams
            </h2>
            <p className="mt-2 font-sans text-xs italic text-ivoire/50">
              {userEmail}
            </p>
          </div>

          <AdminNav />

          <form
            action={logoutAction}
            className="mt-8 border-t border-bronze/20 pt-6"
          >
            <button
              type="submit"
              className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-ivoire/60 hover:text-or"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Déconnexion
            </button>
          </form>
        </aside>

        <main className="min-w-0 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
