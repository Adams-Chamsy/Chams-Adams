import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import {
  getEvents,
  EVENT_TYPE_LABELS,
  groupByMonth,
  sortEventsByDate,
  statusForEvent,
  type Event,
  type EventStatus,
} from '@/lib/data/events';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Calendrier & Événements',
  description:
    'Défilés, showrooms privés, capsules Tabaski et Magal, presse, rendez-vous — l\'agenda de la Maison Chams Adams.',
  openGraph: {
    title: 'Calendrier — Chams Adams',
    description:
      "L'agenda de la Maison : défilés, showrooms privés, capsules et rendez-vous.",
  },
};

const MONTH_LABELS: Record<string, string> = {
  '01': 'Janvier',
  '02': 'Février',
  '03': 'Mars',
  '04': 'Avril',
  '05': 'Mai',
  '06': 'Juin',
  '07': 'Juillet',
  '08': 'Août',
  '09': 'Septembre',
  '10': 'Octobre',
  '11': 'Novembre',
  '12': 'Décembre',
};

const STATUS_LABELS: Record<EventStatus, string> = {
  upcoming: 'À venir',
  ongoing: 'En cours',
  past: 'Passé',
};

export default async function EvenementsPage() {
  const events = await getEvents();
  const sorted = sortEventsByDate(events);
  const today = new Date().toISOString().slice(0, 10);
  const grouped = groupByMonth(sorted);
  const monthKeys = Object.keys(grouped).sort();

  return (
    <>
      {/* Header */}
      <section className="bg-noir pt-[140px] pb-[60px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Calendrier' },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Agenda de la Maison
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light text-balance leading-[1.05] text-ivoire text-[clamp(2.75rem,6vw,5rem)]"
          >
            Calendrier
          </TextReveal>
          <p className="max-w-prose font-serif italic leading-relaxed text-ivoire/75 text-xl md:text-2xl">
            Défilés, showrooms privés, capsules Tabaski et Magal, presse&nbsp;—
            les rendez-vous où la Maison se donne à voir.
          </p>
        </div>
      </section>

      {/* Liste groupée par mois */}
      <section
        aria-labelledby="evenements-title"
        className="bg-noir pb-[160px]"
      >
        <h2 id="evenements-title" className="sr-only">
          Prochains événements
        </h2>
        <div className="container-content flex flex-col gap-20">
          {monthKeys.map((key) => {
            const [year, month] = key.split('-') as [string, string];
            const monthLabel = MONTH_LABELS[month];
            return (
              <div key={key} className="flex flex-col gap-8">
                <div className="flex items-baseline gap-4 border-b border-bronze/25 pb-4">
                  <h3 className="font-serif text-3xl font-light text-ivoire md:text-4xl">
                    {monthLabel}
                  </h3>
                  <span className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/50">
                    {year}
                  </span>
                </div>
                <ul className="flex flex-col divide-y divide-bronze/15">
                  {grouped[key]!.map((e) => (
                    <EventRow
                      key={e.id}
                      event={e}
                      status={statusForEvent(e, today)}
                    />
                  ))}
                </ul>
              </div>
            );
          })}

          {monthKeys.length === 0 && (
            <p className="font-serif italic text-ivoire/60">
              Aucun événement programmé pour le moment. Revenez bientôt.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

function EventRow({ event, status }: { event: Event; status: EventStatus }) {
  const dayLabel = formatDay(event.date, event.endDate);
  const typeLabel = EVENT_TYPE_LABELS[event.type];
  const isPast = status === 'past';

  return (
    <li
      className={cn(
        'group grid grid-cols-1 items-start gap-6 py-8 md:grid-cols-12 md:gap-8',
        isPast && 'opacity-60'
      )}
    >
      {/* Date */}
      <div className="md:col-span-2">
        <p className="font-serif text-3xl font-light leading-none text-ivoire md:text-4xl">
          {dayLabel}
        </p>
        <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.3em] text-or">
          {typeLabel}
        </p>
      </div>

      {/* Titre + description */}
      <div className="flex flex-col gap-3 md:col-span-7">
        <h4 className="font-serif text-xl font-light leading-tight text-ivoire md:text-2xl">
          {event.title}
        </h4>
        <p className="font-serif italic text-ivoire/70 text-base md:text-lg leading-relaxed">
          {event.description}
        </p>
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/55">
          {event.location} · {event.city}
          {event.country && event.country !== '—' && event.country !== 'Monde'
            ? `, ${event.country}`
            : ''}
        </p>
      </div>

      {/* Statut + CTA */}
      <div className="flex flex-col items-start gap-3 md:col-span-3 md:items-end">
        <span
          className={cn(
            'inline-block border px-3 py-1 font-sans text-[10px] uppercase tracking-[0.25em]',
            status === 'upcoming' && 'border-or/70 text-or',
            status === 'ongoing' && 'border-ivoire text-ivoire',
            status === 'past' && 'border-ivoire/30 text-ivoire/50'
          )}
        >
          {STATUS_LABELS[status]}
        </span>
        {event.cta && !isPast && (
          <Link
            href={event.cta.href}
            data-cursor="hover"
            className="font-sans text-xs uppercase tracking-[0.25em] text-or underline-offset-4 hover:underline"
          >
            {event.cta.label}{' '}
            <span aria-hidden className="ml-1">
              →
            </span>
          </Link>
        )}
      </div>
    </li>
  );
}

function formatDay(startIso: string, endIso?: string): string {
  const startDay = startIso.slice(8, 10);
  if (!endIso) return startDay;
  const endDay = endIso.slice(8, 10);
  const sameMonth = startIso.slice(0, 7) === endIso.slice(0, 7);
  if (sameMonth) return `${startDay}–${endDay}`;
  return `${startDay} — ${endDay}`;
}
