import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { CustomerSignupForm } from './SignupForm';

export const metadata: Metadata = {
  title: 'Créer un accès',
  description: 'Rejoindre l’espace privé Chams Adams.',
};

export default async function CustomerSignupPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect('/compte');

  return (
    <>
      <section className="bg-noir pt-[140px] pb-[60px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Compte', href: '/compte' },
              { label: 'Inscription' },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Rejoindre
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.5rem,5.5vw,4.5rem)]"
          >
            Créer un accès
          </TextReveal>
          <p className="max-w-prose font-serif italic text-ivoire/75 text-lg">
            Pour suivre vos commandes, vos points de fidélité, et vos retours
            depuis un seul endroit.
          </p>
        </div>
      </section>

      <section className="bg-noir pb-[160px]">
        <div className="container-content max-w-xl">
          <CustomerSignupForm />
        </div>
      </section>
    </>
  );
}
