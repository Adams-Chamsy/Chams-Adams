import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Package,
  Sparkles,
  RotateCcw,
  Ruler,
  BookHeart,
  Crown,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { CustomerSignupForm } from './SignupForm';

export const metadata: Metadata = {
  title: 'Rejoindre la maison',
  description:
    'Créer votre accès Chams Adams — gabarit, commandes, points de fidélité, carnets de cérémonie.',
};

const BENEFITS = [
  {
    icon: Package,
    label: 'Vos commandes',
    body: "Suivez le voyage de chaque pièce, de l'atelier à votre porte.",
  },
  {
    icon: Ruler,
    label: 'Votre gabarit',
    body: 'Mesures conservées, transmises à chaque demande sur-mesure.',
  },
  {
    icon: BookHeart,
    label: 'Carnets de cérémonie',
    body: 'Listes partageables avec vos proches — mariage, Tabaski, Magal.',
  },
  {
    icon: Sparkles,
    label: 'Points de fidélité',
    body: 'Un euro dépensé, un point. La maison vous tient compte.',
  },
  {
    icon: RotateCcw,
    label: 'Retours sereins',
    body: 'Initiez et suivez vos demandes en quelques gestes.',
  },
  {
    icon: Crown,
    label: 'Cercle privé',
    body: 'Accès anticipé aux collections sur invitation, conseillère dédiée.',
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
      {/* HERO */}
      <section className="bg-noir pt-[140px] pb-[40px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Compte', href: '/compte' },
              { label: 'Rejoindre' },
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
            className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.5rem,6vw,5rem)]"
          >
            Rejoindre la maison
          </TextReveal>
          <p className="max-w-prose font-serif italic leading-relaxed text-ivoire/75 text-xl md:text-2xl">
            Un seul endroit pour vos commandes, vos mesures, vos carnets et la
            relation avec notre atelier.
          </p>
        </div>
      </section>

      {/* CORPS — 2 colonnes : form gauche / bénéfices droite */}
      <section className="bg-noir pb-[160px]">
        <div className="container-content grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Formulaire — colonne gauche, sticky sur desktop */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-or">
                  Créer un accès
                </span>
                <p className="font-serif italic text-ivoire/70">
                  Trois informations suffisent. Le reste se compose à votre
                  rythme.
                </p>
              </div>
              <CustomerSignupForm />

              <p className="border-t border-bronze/15 pt-6 font-sans text-[11px] italic leading-relaxed text-ivoire/50">
                Vos données sont gardées en confidence. Le compte n&apos;est
                jamais une obligation pour acheter — il est un confort qu&apos;on
                vous offre.
              </p>
            </div>
          </div>

          {/* Bénéfices — colonne droite, éditoriale */}
          <aside
            aria-labelledby="benefits-title"
            className="flex flex-col gap-10 lg:col-span-6 lg:col-start-7"
          >
            <div className="flex flex-col gap-3">
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-or">
                Ce que la maison vous offre
              </span>
              <h2
                id="benefits-title"
                className="font-serif font-light leading-tight text-ivoire text-[clamp(1.75rem,3.5vw,2.75rem)]"
              >
                Six attentions, gardées avec soin
              </h2>
            </div>

            <ul className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
              {BENEFITS.map(({ icon: Icon, label, body }) => (
                <li key={label} className="flex flex-col gap-3">
                  <Icon className="h-5 w-5 text-or" aria-hidden />
                  <h3 className="font-serif text-xl font-light text-ivoire">
                    {label}
                  </h3>
                  <p className="font-serif italic leading-relaxed text-ivoire/65">
                    {body}
                  </p>
                </li>
              ))}
            </ul>

            {/* Citation éditoriale */}
            <figure className="mt-4 flex flex-col gap-4 border-t border-bronze/15 pt-10">
              <span aria-hidden className="h-px w-10 bg-or/60" />
              <blockquote className="font-serif italic leading-[1.5] text-ivoire/80 text-xl md:text-2xl">
                « Une maison qui vous reconnaît au seuil — la couture est
                d&apos;abord une attention soutenue. »
              </blockquote>
            </figure>
          </aside>
        </div>
      </section>
    </>
  );
}
