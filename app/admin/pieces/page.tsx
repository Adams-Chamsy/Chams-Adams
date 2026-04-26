import Link from 'next/link';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { PieceRow } from '@/lib/supabase/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

async function getPieces(): Promise<PieceRow[]> {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from('pieces')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  return (data ?? []) as PieceRow[];
}

export default async function AdminPiecesPage() {
  const items = await getPieces();
  const pending = items.filter((p) => !p.certificate_published).length;

  return (
    <section className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow={`${pending} certificat${pending > 1 ? 's' : ''} à compléter · ${items.length} pièce${items.length > 1 ? 's' : ''} total`}
        title="Pièces & certificats"
      />

      {items.length === 0 ? (
        <p className="font-serif italic text-ivoire/60">
          Aucune pièce. Les pièces sont créées automatiquement à la confirmation
          de paiement.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr className="border-b border-bronze/25 text-left font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                <th className="py-3 pr-4 font-normal">N°</th>
                <th className="py-3 pr-4 font-normal">Pièce</th>
                <th className="py-3 pr-4 font-normal">Propriétaire</th>
                <th className="py-3 pr-4 font-normal">Initiale</th>
                <th className="py-3 pr-4 font-normal">Reçue</th>
                <th className="py-3 pr-4 font-normal">Certificat</th>
                <th className="py-3 font-normal">&nbsp;</th>
              </tr>
            </thead>
            <tbody className="font-serif text-ivoire">
              {items.map((p) => (
                <tr key={p.id} className="border-b border-bronze/10">
                  <td className="py-4 pr-4">
                    <code className="font-mono text-sm text-or">
                      {p.piece_number}
                    </code>
                  </td>
                  <td className="py-4 pr-4 text-sm">
                    {p.product_name}
                    <div className="text-xs italic text-ivoire/60">
                      {p.size ?? '—'}
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-sm">
                    {p.owner_name ?? p.owner_email}
                  </td>
                  <td className="py-4 pr-4 font-mono text-sm text-or">
                    {p.monogram ?? '—'}
                  </td>
                  <td className="py-4 pr-4 font-sans text-xs text-ivoire/60">
                    {DATE_FMT.format(new Date(p.created_at))}
                  </td>
                  <td className="py-4 pr-4">
                    {p.certificate_published ? (
                      <span className="inline-block border border-or/60 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-or">
                        Publié
                      </span>
                    ) : (
                      <span className="inline-block border border-ivoire/30 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-ivoire/60">
                        À compléter
                      </span>
                    )}
                  </td>
                  <td className="py-4">
                    <Link
                      href={`/admin/pieces/${p.id}`}
                      className="font-sans text-xs uppercase tracking-[0.2em] text-or hover:underline"
                    >
                      Éditer
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
