import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from '@/lib/supabase/server';
import type { CustomerMeasurementsRow } from '@/lib/supabase/types';
import { GabaritForm } from './GabaritForm';

export const metadata: Metadata = {
  title: 'Mon gabarit',
  description:
    'Enregistrez vos mesures personnelles pour vos pièces sur-mesure et nos recommandations de taille.',
};

export default async function GabaritPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/compte/connexion?next=/compte/gabarit');

  const service = createSupabaseServiceClient();
  const { data } = await service
    .from('customer_measurements')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  return (
    <>
      <section className="bg-noir pt-[140px] pb-[60px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Compte', href: '/compte' },
              { label: 'Mon gabarit' },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Profil de mesures
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.5rem,5.5vw,4.5rem)]"
          >
            Mon gabarit
          </TextReveal>
          <p className="max-w-prose font-serif italic text-ivoire/75 text-lg leading-relaxed">
            Vos mesures, gardées en confidence. Elles pré-remplissent vos
            demandes sur-mesure et nous permettent de vous suggérer la bonne
            taille en prêt-à-porter.
          </p>
        </div>
      </section>

      <section className="bg-noir pb-[160px]">
        <div className="container-content">
          <GabaritForm initial={(data as CustomerMeasurementsRow) ?? null} />

          <Link
            href="/compte"
            className="mt-12 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-ivoire/70 hover:text-or"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Retour au compte
          </Link>
        </div>
      </section>
    </>
  );
}
