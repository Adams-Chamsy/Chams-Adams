import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import {
  BenefitsCarousel,
  type BenefitIconName,
} from '@/components/sections/BenefitsCarousel';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { CustomerSignupForm } from './SignupForm';

export const metadata: Metadata = {
  title: 'Rejoindre la maison',
  description:
    'Créer votre accès Chams Adams — gabarit, commandes, points de fidélité, carnets de cérémonie.',
};

const BENEFITS: Array<{ icon: BenefitIconName; label: string; body: string }> = [
  {
    icon: 'package',
    label: 'Vos commandes',
    body: "De l'atelier à votre porte, suivies dans un seul endroit.",
  },
  {
    icon: 'ruler',
    label: 'Votre gabarit',
    body: 'Mesures conservées, transmises à chaque demande sur-mesure.',
  },
  {
    icon: 'carnet',
    label: 'Carnets de cérémonie',
    body: 'Listes partageables — mariage, Tabaski, Magal.',
  },
  {
    icon: 'sparkles',
    label: 'Fidélité',
    body: 'Un euro dépensé, un point. La maison vous tient compte.',
  },
];

export default async function CustomerSignupPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect('/compte');

  return (
    <>
      {/* JSON-LD breadcrumb seul (pas de rendu visuel) */}
      <Breadcrumbs
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Compte', href: '/compte' },
          { label: 'Rejoindre' },
        ]}
      />

      <section className="bg-noir pt-[120px] pb-[100px] md:pt-[140px] md:pb-[120px]">
        <div className="container-content">
          {/* HEADER COMPACT — eyebrow + h1 + lede sur 2 colonnes */}
          <header className="mb-12 grid grid-cols-1 gap-6 md:mb-16 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-or">
                Espace privé
              </span>
              <TextReveal
                as="h1"
                splitBy="words"
                stagger={0.06}
                duration={0.8}
                className="mt-3 font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.25rem,5vw,4rem)]"
              >
                Rejoindre la maison
              </TextReveal>
            </div>
            <p className="max-w-prose self-end font-serif italic leading-relaxed text-ivoire/70 text-lg lg:col-span-5">
              Un seul endroit pour vos commandes, vos mesures, vos carnets et la
              relation avec notre atelier.
            </p>
          </header>

          {/* CORPS — form 5/12 + bénéfices 7/12 (équilibre rééquilibré) */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Formulaire — colonne gauche plus étroite */}
            <div className="lg:col-span-5">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-or">
                Créer un accès
              </span>
              <p className="mt-3 mb-8 font-serif italic text-ivoire/65">
                Trois informations suffisent.
              </p>
              <CustomerSignupForm />
              <p className="mt-8 border-t border-bronze/15 pt-5 font-sans text-[10px] uppercase tracking-[0.25em] text-ivoire/40">
                Le compte n&apos;est jamais une obligation pour acheter.
              </p>
            </div>

            {/* Bénéfices — carousel éditorial : une promesse à la fois */}
            <aside
              aria-labelledby="benefits-title"
              className="lg:col-span-7 lg:pl-8"
            >
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-or">
                Ce que la maison vous offre
              </span>
              <h2
                id="benefits-title"
                className="mt-3 mb-12 font-serif font-light leading-tight text-ivoire text-[clamp(1.75rem,3vw,2.5rem)]"
              >
                Quatre attentions, gardées avec soin
              </h2>
              <BenefitsCarousel benefits={BENEFITS} intervalMs={6000} />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
