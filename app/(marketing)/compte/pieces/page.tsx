import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from '@/lib/supabase/server';
import type { PieceRow } from '@/lib/supabase/types';

export const metadata: Metadata = {
  title: 'Mes pièces',
};

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export default async function MesPiecesPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) redirect('/compte/connexion?next=/compte/pieces');

  const service = createSupabaseServiceClient();
  const { data } = await service
    .from('pieces')
    .select('*')
    .or(`owner_user_id.eq.${user.id},owner_email.eq.${user.email}`)
    .order('created_at', { ascending: false });

  const pieces = (data ?? []) as PieceRow[];

  return (
    <>
      <section className="bg-noir pt-[140px] pb-[60px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Compte', href: '/compte' },
              { label: 'Mes pièces' },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Documentées à vie
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.5rem,5.5vw,4.5rem)]"
          >
            Mes pièces
          </TextReveal>
          <p className="max-w-prose font-serif italic text-ivoire/75 text-lg leading-relaxed">
            Chaque pièce confectionnée pour vous est numérotée, signée par
            son artisan, et accompagnée d&apos;un registre de vie : retouches,
            entretiens, transmission. La maison reste à vos côtés.
          </p>
        </div>
      </section>

      <section className="bg-noir pb-[160px]">
        <div className="container-content">
          {pieces.length === 0 ? (
            <p className="font-serif italic text-ivoire/70 text-lg">
              Aucune pièce documentée à votre nom pour le moment.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {pieces.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-col gap-3 border border-bronze/30 p-6"
                >
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-or">
                    {p.piece_number}
                  </span>
                  <h2 className="font-serif text-2xl font-light text-ivoire">
                    {p.product_name}
                  </h2>
                  <div className="flex flex-col gap-1 font-serif italic text-sm text-ivoire/60">
                    {p.size && <span>Taille {p.size}</span>}
                    {p.monogram && (
                      <span>
                        Monogramme :{' '}
                        <code className="font-mono text-or">{p.monogram}</code>
                      </span>
                    )}
                    {p.completed_at && (
                      <span>
                        Confectionnée le {DATE_FMT.format(new Date(p.completed_at))}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/compte/pieces/${p.piece_number}`}
                      className="font-sans text-xs uppercase tracking-[0.2em] text-or hover:underline"
                    >
                      Ouvrir le registre →
                    </Link>
                    {p.certificate_published && (
                      <Link
                        href={`/api/pieces/${p.piece_number}/certificat`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-sans text-xs uppercase tracking-[0.2em] text-ivoire/70 hover:text-or"
                      >
                        <FileText className="h-3.5 w-3.5" aria-hidden />
                        Certificat
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

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
