import 'server-only';
import {
  createSupabaseServerClient,
  isSupabaseEnabled,
} from '@/lib/supabase/server';
import { sanityClient, isSanityEnabled } from '@/lib/sanity/client';
import { ALL_EVENTS_QUERY } from '@/lib/sanity/queries';
import { EVENTS as EVENTS_MOCK, type Event } from './events.mock';

export type { Event } from './events.mock';
export {
  EVENT_TYPE_LABELS,
  groupByMonth,
  sortEventsByDate,
  statusForEvent,
  type EventStatus,
  type EventType,
} from './events.mock';

/** Loader Events — Supabase → Sanity → mock. */
export async function getEvents(): Promise<Event[]> {
  if (isSupabaseEnabled()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data } = await supabase
        .from('events')
        .select(
          'id, title, type, start_date, end_date, location, city, country, description, cta'
        )
        .eq('published', true)
        .order('start_date', { ascending: true });
      if (data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          title: row.title,
          type: row.type as Event['type'],
          date: row.start_date,
          endDate: row.end_date ?? undefined,
          location: row.location ?? '',
          city: row.city ?? '',
          country: row.country ?? '',
          description: row.description ?? '',
          cta: row.cta ?? undefined,
        }));
      }
    } catch (err) {
      console.error('[supabase] getEvents fallback:', err);
    }
  }

  if (isSanityEnabled()) {
    try {
      const data = await sanityClient.fetch<Event[]>(
        ALL_EVENTS_QUERY,
        {},
        { next: { revalidate: 60, tags: ['events'] } }
      );
      if (data.length > 0) return data;
    } catch {
      // noop
    }
  }

  return EVENTS_MOCK;
}
