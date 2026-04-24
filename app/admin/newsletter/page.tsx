import { Download } from 'lucide-react';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { NewsletterSubscriberRow } from '@/lib/supabase/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton';
import {
  deleteSubscriberAction,
  resubscribeAction,
  unsubscribeAction,
} from './actions';

async function getSubscribers(): Promise<NewsletterSubscriberRow[]> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []) as NewsletterSubscriberRow[];
}

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function exportCsvHref(rows: NewsletterSubscriberRow[]): string {
  const active = rows.filter((r) => !r.unsubscribed_at);
  const csv = ['email,subscribed_at', ...active.map((r) => `${r.email},${r.subscribed_at}`)].join('\n');
  return `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
}

export default async function AdminNewsletterPage() {
  const subs = await getSubscribers();
  const activeCount = subs.filter((s) => !s.unsubscribed_at).length;

  return (
    <section className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow={`${activeCount} abonnés actifs sur ${subs.length}`}
        title="Newsletter"
        action={
          subs.length > 0 ? (
            <a
              href={exportCsvHref(subs)}
              download={`newsletter-${new Date().toISOString().slice(0, 10)}.csv`}
              className="inline-flex items-center gap-2 border border-or/60 px-4 py-2 font-sans text-xs uppercase tracking-[0.2em] text-or hover:bg-or/10"
            >
              <Download className="h-4 w-4" aria-hidden />
              Export CSV (actifs)
            </a>
          ) : undefined
        }
      />

      {subs.length === 0 ? (
        <p className="font-serif italic text-ivoire/60">
          Aucun abonné pour l&apos;instant.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="border-b border-bronze/25 text-left font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                <th className="py-3 pr-4 font-normal">Email</th>
                <th className="py-3 pr-4 font-normal">Inscrit</th>
                <th className="py-3 pr-4 font-normal">Statut</th>
                <th className="py-3 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="font-serif text-ivoire">
              {subs.map((s) => {
                const active = !s.unsubscribed_at;
                return (
                  <tr
                    key={s.id}
                    className="border-b border-bronze/10 transition-colors hover:bg-ivoire/[0.02]"
                  >
                    <td className="py-4 pr-4 text-sm">{s.email}</td>
                    <td className="py-4 pr-4 text-sm text-ivoire/70">
                      {DATE_FMT.format(new Date(s.subscribed_at))}
                    </td>
                    <td className="py-4 pr-4">
                      {active ? (
                        <span className="inline-block border border-or/60 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-or">
                          Abonné
                        </span>
                      ) : (
                        <span className="inline-block border border-ivoire/30 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-ivoire/50">
                          Désabonné
                        </span>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        {active ? (
                          <form action={unsubscribeAction.bind(null, s.id)}>
                            <button
                              type="submit"
                              className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/60 hover:text-destructive"
                            >
                              Désabonner
                            </button>
                          </form>
                        ) : (
                          <form action={resubscribeAction.bind(null, s.id)}>
                            <button
                              type="submit"
                              className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/60 hover:text-or"
                            >
                              Réabonner
                            </button>
                          </form>
                        )}
                        <DeleteConfirmButton
                          action={deleteSubscriberAction.bind(null, s.id)}
                          itemName={s.email}
                          itemLabel="cet abonné"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 font-serif italic text-sm text-ivoire/50">
        Pour l&apos;envoi réel des campagnes, exporte la liste CSV et importe-la
        dans Resend / Brevo / Mailchimp. Un outil d&apos;envoi natif arrivera
        dans une vague dédiée.
      </p>
    </section>
  );
}
