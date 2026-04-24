import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Administration',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage(props: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await props.searchParams;
  return (
    <div className="relative z-[100] flex min-h-screen items-center justify-center bg-noir px-6">
      <div className="w-full max-w-sm border border-bronze/30 bg-[#0F0E0C] p-10">
        <div className="mb-8 flex flex-col gap-2">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-or">
            Administration
          </span>
          <h1 className="font-serif text-2xl font-light text-ivoire">
            Connexion
          </h1>
          <p className="font-serif italic text-sm text-ivoire/60">
            Accès réservé à la maison Chams Adams.
          </p>
        </div>

        {params.error === 'forbidden' && (
          <p className="mb-6 border border-destructive/50 px-3 py-2 font-sans text-xs text-destructive">
            Votre session n&apos;a pas les droits requis. Contactez
            l&apos;administrateur.
          </p>
        )}

        <LoginForm next={params.next} />
      </div>
    </div>
  );
}
