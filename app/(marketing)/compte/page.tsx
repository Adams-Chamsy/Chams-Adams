import type { Metadata } from 'next';
import Link from 'next/link';
import { Package, Sparkles, RotateCcw, LogOut, Heart } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from '@/lib/supabase/server';
import type { VipMemberRow } from '@/lib/supabase/types';
import { customerLogoutAction } from './actions';

export const metadata: Metadata = {
  title: 'Mon compte',
  description: 'Suivre vos commandes, vos points et vos retours.',
};

const TIER_LABEL: Record<string, string> = {
  silver: 'Cercle Silver',
  gold: 'Cercle Gold',
  platinum: 'Cercle Platinum',
};

export default async function ComptePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <UnauthenticatedView />;
  }

  // Récupère VIP + soldes en parallèle (service role pour bypass RLS et lookup par email)
  const service = createSupabaseServiceClient();
  const email = user.email ?? '';
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ?? null;

  const [vipRes, loyaltyRes, ordersRes] = await Promise.all([
    service
      .from('vip_members')
      .select('*')
      .eq('email', email)
      .eq('active', true)
      .maybeSingle(),
    service
      .from('loyalty_points')
      .select('points')
      .eq('email', email),
    service
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('email', email),
  ]);

  const vip = vipRes.data as VipMemberRow | null;
  const loyaltyTotal = (loyaltyRes.data ?? []).reduce(
    (s, r) => s + (r.points as number),
    0
  );
  const ordersCount = ordersRes.count ?? 0;

  return (
    <>
      <section className="bg-noir pt-[140px] pb-[40px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[{ label: 'Accueil', href: '/' }, { label: 'Compte' }]}
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
            {`Bonjour ${fullName ? fullName.split(' ')[0] ?? fullName : email.split('@')[0] ?? email}`}
          </TextReveal>
          <p className="font-serif italic text-ivoire/70 text-lg">{email}</p>
        </div>
      </section>

      {vip && (
        <section className="bg-noir pb-[20px]">
          <div className="container-content">
            <div className="flex flex-wrap items-center justify-between gap-4 border border-or/50 bg-or/5 px-6 py-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-or" aria-hidden />
                <span className="font-serif italic text-ivoire">
                  Vous êtes membre du <strong>{TIER_LABEL[vip.tier]}</strong>
                </span>
              </div>
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-or">
                Avantages exclusifs activés
              </span>
            </div>
          </div>
        </section>
      )}

      <section className="bg-noir pb-[160px]">
        <div className="container-content grid grid-cols-1 gap-6 md:grid-cols-3">
          <DashboardCard
            href="/compte/commandes"
            icon={Package}
            label="Commandes"
            value={`${ordersCount}`}
            hint={ordersCount === 0 ? 'Aucune pour le moment' : `${ordersCount} passée${ordersCount > 1 ? 's' : ''}`}
          />
          <DashboardCard
            href="/compte/fidelite"
            icon={Sparkles}
            label="Points fidélité"
            value={loyaltyTotal.toLocaleString('fr-FR')}
            hint="1 € dépensé = 1 point"
          />
          <DashboardCard
            href="/compte/retours"
            icon={RotateCcw}
            label="Retours"
            value="—"
            hint="Suivre vos demandes"
          />
        </div>

        <div className="container-content mt-12 flex flex-wrap items-center gap-6">
          <Link
            href="/wishlist"
            className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-ivoire/70 hover:text-or"
          >
            <Heart className="h-4 w-4" aria-hidden />
            Mes envies
          </Link>
          <form action={customerLogoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-ivoire/70 hover:text-or"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Déconnexion
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

function DashboardCard({
  href,
  icon: Icon,
  label,
  value,
  hint,
}: {
  href: string;
  icon: typeof Package;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 border border-bronze/30 p-6 transition-colors duration-300 hover:border-or"
    >
      <Icon
        className="h-5 w-5 text-or transition-transform duration-500 group-hover:-translate-y-0.5"
        aria-hidden
      />
      <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/60">
        {label}
      </span>
      <span className="font-serif text-3xl font-light text-ivoire">
        {value}
      </span>
      <span className="font-serif italic text-sm text-ivoire/60">{hint}</span>
    </Link>
  );
}

function UnauthenticatedView() {
  return (
    <>
      <section className="bg-noir pt-[140px] pb-[60px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[{ label: 'Accueil', href: '/' }, { label: 'Compte' }]}
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
            Mon compte
          </TextReveal>
          <p className="max-w-prose font-serif italic text-ivoire/75 text-lg">
            Connectez-vous pour suivre vos commandes, vos points de fidélité,
            et l&apos;avancement de vos demandes.
          </p>
        </div>
      </section>

      <section className="bg-noir pb-[160px]">
        <div className="container-content flex flex-col gap-4 md:flex-row md:gap-6">
          <Link
            href="/compte/connexion"
            className="border border-or bg-or px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
          >
            Se connecter
          </Link>
          <Link
            href="/compte/inscription"
            className="border border-or/60 px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-or hover:bg-or/10"
          >
            Créer un accès
          </Link>
        </div>
      </section>
    </>
  );
}
