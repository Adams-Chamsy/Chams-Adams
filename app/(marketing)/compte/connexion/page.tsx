import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { CustomerLoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Se connecter',
  description: 'Accéder à votre compte Chams Adams.',
};

export default async function CustomerLoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const { next } = searchParams;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(next ?? '/compte');

  return (
    <>
      <section className="bg-noir pt-[140px] pb-[60px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Compte', href: '/compte' },
              { label: 'Connexion' },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Espace privé
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.5rem,5.5vw,4.5rem)]"
          >
            Se connecter
          </TextReveal>
        </div>
      </section>

      <section className="bg-noir pb-[160px]">
        <div className="container-content max-w-xl">
          <CustomerLoginForm next={next} />
        </div>
      </section>
    </>
  );
}
