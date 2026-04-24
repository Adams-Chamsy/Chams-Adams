import 'server-only';
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

/**
 * Charge les événements depuis Sanity avec fallback mock.
 * Revalidation ISR : 60s (événements ne changent pas souvent).
 */
export async function getEvents(): Promise<Event[]> {
  if (!isSanityEnabled()) return EVENTS_MOCK;
  try {
    const data = await sanityClient.fetch<Event[]>(
      ALL_EVENTS_QUERY,
      {},
      { next: { revalidate: 60, tags: ['events'] } }
    );
    return data.length > 0 ? data : EVENTS_MOCK;
  } catch (err) {
    console.error('[sanity] getEvents fallback mock:', err);
    return EVENTS_MOCK;
  }
}
