import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from '@/lib/supabase/server';
import type {
  PieceEventRow,
  PieceRow,
} from '@/lib/supabase/types';
import { TransferForm } from './TransferForm';

export const metadata: Metadata = {
  title: 'Registre de la pièce',
};

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

const TYPE_LABEL: Record<string, string> = {
  creation: 'Confection',
  retouche: 'Retouche',
  entretien: 'Entretien',
  transmission: 'Transmission',
  note: 'Note',
};

export default async function PieceRegisterPage(props: {
  params: Promise<{ piece_number: string }>;
}) {
  const { piece_number } = await props.params;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email)
    redirect(`/compte/connexion?next=/compte/pieces/${piece_number}`);

  const service = createSupabaseServiceClient();
  const { data: pieceData } = await service
    .from('pieces')
    .select('*')
    .eq('piece_number', piece_number)
    .or(`owner_user_id.eq.${user.id},owner_email.eq.${user.email}`)
    .maybeSingle();
  if (!pieceData) notFound();
  const piece = pieceData as PieceRow;

  const { data: eventsData } = await service
    .from('piece_events')
    .select('*')
    .eq('piece_id', piece.id)
    .order('occurred_at', { ascending: false });
  const events = (eventsData ?? []) as PieceEventRow[];

  return (
    <>
      <section className="bg-noir pt-[140px] pb-[60px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Compte', href: '/compte' },
              { label: 'Pièces', href: '/compte/pieces' },
              { label: piece.piece_number },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Pièce N° {piece.piece_number}
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2rem,5vw,4rem)]"
          >
            {piece.product_name}
          </TextReveal>
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 font-serif italic text-ivoire/70">
            {piece.size && <span>Taille {piece.size}</span>}
            {piece.monogram && (
              <span>
                Monogramme :{' '}
                <code className="font-mono text-or">{piece.monogram}</code>
              </span>
            )}
          </div>
          {piece.certificate_published && (
            <Link
              href={`/api/pieces/${piece.piece_number}/certificat`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start border border-or bg-or px-5 py-2.5 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
            >
              <FileText className="h-4 w-4" aria-hidden />
              Voir le certificat d&apos;origine
            </Link>
          )}
        </div>
      </section>

      <section className="bg-noir pb-[80px]">
        <div className="container-content grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="border border-bronze/30 p-6">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.3em] text-or">
              Confection
            </h2>
            <dl className="mt-4 flex flex-col gap-3 font-serif italic text-ivoire/80">
              {piece.artisan_name && (
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-[0.2em] text-ivoire/50">
                    Main
                  </dt>
                  <dd>
                    {piece.artisan_name}
                    {piece.artisan_role ? ` · ${piece.artisan_role}` : ''}
                  </dd>
                </div>
              )}
              {piece.completed_at && (
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-[0.2em] text-ivoire/50">
                    Achevée
                  </dt>
                  <dd>{DATE_FMT.format(new Date(piece.completed_at))}</dd>
                </div>
              )}
              {piece.embroidery_hours != null && (
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-[0.2em] text-ivoire/50">
                    Heures de broderie
                  </dt>
                  <dd>{piece.embroidery_hours} h</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="border border-bronze/30 p-6">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.3em] text-or">
              Tissu
            </h2>
            <dl className="mt-4 flex flex-col gap-3 font-serif italic text-ivoire/80">
              {piece.fabric_origin && (
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-[0.2em] text-ivoire/50">
                    Provenance
                  </dt>
                  <dd>{piece.fabric_origin}</dd>
                </div>
              )}
              {piece.fabric_lot && (
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-[0.2em] text-ivoire/50">
                    Lot
                  </dt>
                  <dd>
                    <code className="font-mono text-sm text-or">
                      {piece.fabric_lot}
                    </code>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-noir pb-[80px]">
        <div className="container-content max-w-3xl">
          <h2 className="mb-6 font-serif text-2xl font-light text-ivoire">
            Registre de la pièce
          </h2>
          {events.length === 0 ? (
            <p className="font-serif italic text-ivoire/60">
              Aucun événement enregistré.
            </p>
          ) : (
            <ol className="flex flex-col gap-5">
              {events.map((e) => (
                <li
                  key={e.id}
                  className="border-l-2 border-or/40 pl-4"
                >
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-or">
                    {TYPE_LABEL[e.event_type] ?? e.event_type} ·{' '}
                    {DATE_FMT.format(new Date(e.occurred_at))}
                  </span>
                  {e.note && (
                    <p className="mt-1 font-serif italic text-ivoire/80">
                      {e.note}
                    </p>
                  )}
                  {e.event_type === 'transmission' &&
                    e.transferred_to_email && (
                      <p className="mt-1 font-sans text-xs italic text-ivoire/50">
                        Transmise à {e.transferred_to_email}
                      </p>
                    )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <section className="bg-noir pb-[160px]">
        <div className="container-content max-w-3xl flex flex-col gap-6">
          <h2 className="font-serif text-2xl font-light text-ivoire">
            Transmettre cette pièce
          </h2>
          <p className="font-serif italic text-ivoire/70">
            Vous offrez votre pièce à quelqu&apos;un — un proche, un héritier.
            Cette transmission devient un événement permanent du registre.
            La maison continue à veiller sur elle, désormais au nom de votre
            héritier.
          </p>
          <TransferForm pieceNumber={piece.piece_number} />

          <Link
            href="/compte/pieces"
            className="mt-8 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-ivoire/70 hover:text-or"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Toutes mes pièces
          </Link>
        </div>
      </section>
    </>
  );
}
