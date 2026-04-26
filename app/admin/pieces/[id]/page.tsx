import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type {
  PieceEventRow,
  PieceRow,
} from '@/lib/supabase/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { addPieceEventAction, updatePieceAction } from '../actions';

const inputCls =
  'w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none';

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export default async function AdminPieceEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = createSupabaseServiceClient();
  const { data: pieceData } = await supabase
    .from('pieces')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (!pieceData) notFound();
  const piece = pieceData as PieceRow;

  const { data: eventsData } = await supabase
    .from('piece_events')
    .select('*')
    .eq('piece_id', id)
    .order('occurred_at', { ascending: false });
  const events = (eventsData ?? []) as PieceEventRow[];

  const updateBound = updatePieceAction.bind(null, id);
  const addEventBound = addPieceEventAction.bind(null, id);

  return (
    <section className="flex flex-col gap-10 max-w-3xl">
      <AdminPageHeader
        eyebrow={piece.piece_number}
        title={piece.product_name}
        action={
          <Link
            href="/admin/pieces"
            className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-ivoire/70 hover:text-or"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Retour
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-3 border border-bronze/30 p-6 font-serif italic text-ivoire/80 md:grid-cols-2">
        <p>
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
            Propriétaire
          </span>
          <br />
          {piece.owner_name ?? '—'}
          <br />
          <span className="text-xs">{piece.owner_email}</span>
        </p>
        <p>
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
            Caractéristiques
          </span>
          <br />
          {piece.size ?? '—'} · Monogramme{' '}
          <code className="font-mono text-or">{piece.monogram ?? '—'}</code>
        </p>
        <Link
          href={`/api/pieces/${piece.piece_number}/certificat`}
          target="_blank"
          rel="noopener noreferrer"
          className="md:col-span-2 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-or hover:underline"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          Aperçu du certificat (PDF)
        </Link>
      </div>

      <form action={updateBound} className="flex flex-col gap-6">
        <h2 className="font-serif text-xl font-light text-ivoire">
          Données du certificat
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Nom de l'artisan">
            <input
              name="artisan_name"
              type="text"
              defaultValue={piece.artisan_name ?? ''}
              placeholder="Fatou Diagne"
              className={inputCls}
            />
          </Field>
          <Field label="Rôle de l'artisan">
            <input
              name="artisan_role"
              type="text"
              defaultValue={piece.artisan_role ?? ''}
              placeholder="Maîtresse brodeuse"
              className={inputCls}
            />
          </Field>
          <Field label="URL signature manuscrite">
            <input
              name="artisan_signature_url"
              type="url"
              defaultValue={piece.artisan_signature_url ?? ''}
              className={inputCls}
            />
          </Field>
          <Field label="Date d'achèvement">
            <input
              name="completed_at"
              type="date"
              defaultValue={piece.completed_at ?? ''}
              className={inputCls}
            />
          </Field>
          <Field label="Lot du tissu">
            <input
              name="fabric_lot"
              type="text"
              defaultValue={piece.fabric_lot ?? ''}
              placeholder="BAZIN-2026-042"
              className={inputCls}
            />
          </Field>
          <Field label="Provenance du tissu">
            <input
              name="fabric_origin"
              type="text"
              defaultValue={piece.fabric_origin ?? ''}
              placeholder="Atelier Saint-Louis, Sénégal"
              className={inputCls}
            />
          </Field>
          <Field label="Heures de broderie">
            <input
              name="embroidery_hours"
              type="number"
              min={0}
              max={2000}
              defaultValue={piece.embroidery_hours ?? ''}
              className={inputCls}
            />
          </Field>
          <Field label="Notes internes">
            <input
              name="notes"
              type="text"
              defaultValue={piece.notes ?? ''}
              className={inputCls}
            />
          </Field>
        </div>

        <label className="inline-flex items-center gap-3">
          <input
            type="checkbox"
            name="certificate_published"
            defaultChecked={piece.certificate_published}
          />
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/80">
            Certificat publié (visible au client)
          </span>
        </label>

        <button
          type="submit"
          className="self-start border border-or bg-or px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
        >
          Enregistrer
        </button>
      </form>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-xl font-light text-ivoire">
          Registre de la pièce
        </h2>
        {events.length === 0 ? (
          <p className="font-serif italic text-ivoire/60">
            Aucun événement.
          </p>
        ) : (
          <ul className="flex flex-col gap-2 font-serif italic text-ivoire/80">
            {events.map((e) => (
              <li
                key={e.id}
                className="flex items-baseline gap-3 border-l-2 border-or/40 pl-3"
              >
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-or">
                  {e.event_type} · {DATE_FMT.format(new Date(e.occurred_at))}
                </span>
                {e.note && <span>— {e.note}</span>}
              </li>
            ))}
          </ul>
        )}

        <form
          action={addEventBound}
          className="grid grid-cols-1 gap-3 border border-bronze/30 p-6 md:grid-cols-[auto_auto_1fr_auto] md:items-end"
        >
          <Field label="Type">
            <select name="event_type" defaultValue="retouche" className={inputCls}>
              <option value="retouche" className="bg-noir">Retouche</option>
              <option value="entretien" className="bg-noir">Entretien</option>
              <option value="transmission" className="bg-noir">Transmission</option>
              <option value="note" className="bg-noir">Note</option>
            </select>
          </Field>
          <Field label="Date">
            <input name="occurred_at" type="date" className={inputCls} />
          </Field>
          <Field label="Note">
            <input name="note" type="text" placeholder="Ourlet repris à 4 cm" className={inputCls} />
          </Field>
          <button
            type="submit"
            className="border border-or/60 px-4 py-2.5 font-sans text-xs uppercase tracking-[0.2em] text-or hover:bg-or/10"
          >
            Ajouter
          </button>
        </form>
      </section>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
        {label}
      </span>
      {children}
    </label>
  );
}
