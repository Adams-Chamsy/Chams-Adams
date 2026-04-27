import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { CustomerSignupForm } from './SignupForm';

export const metadata: Metadata = {
  title: 'Rejoindre la maison',
  description: 'Créer votre accès Chams Adams.',
};

export default async function CustomerSignupPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect('/compte');

  return (
    <>
      {/* JSON-LD breadcrumb (pas de rendu visuel) */}
      <Breadcrumbs
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Compte', href: '/compte' },
          { label: 'Rejoindre' },
        ]}
      />

      <section className="bg-noir pt-[140px] pb-[160px] md:pt-[180px]">
        <div className="container-content flex flex-col items-center gap-10 text-center">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-or">
            Espace privé
          </span>

          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.8}
            className="max-w-2xl font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.5rem,5.5vw,4.5rem)]"
          >
            Rejoindre la maison
          </TextReveal>

          <p className="max-w-lg font-serif italic leading-relaxed text-ivoire/70 text-lg">
            Trois informations suffisent. Le compte n&apos;est jamais une
            obligation pour acheter — il est un confort que nous vous offrons.
          </p>

          {/* Form, centré, max-w-md */}
          <div className="mt-6 w-full max-w-md text-left">
            <CustomerSignupForm />
          </div>
        </div>
      </section>
    </>
  );
}
