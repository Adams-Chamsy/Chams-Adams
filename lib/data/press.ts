import 'server-only';
import { sanityClient, isSanityEnabled } from '@/lib/sanity/client';
import { ALL_PRESS_QUERY } from '@/lib/sanity/queries';
import { PRESS as PRESS_MOCK, type PressEntry } from './press.mock';

export type { PressEntry } from './press.mock';
export { sortPressByDate } from './press.mock';

/**
 * Charge les parutions presse depuis Sanity avec fallback mock.
 * Revalidation ISR : 5 min.
 */
export async function getPress(): Promise<PressEntry[]> {
  if (!isSanityEnabled()) return PRESS_MOCK;
  try {
    const data = await sanityClient.fetch<PressEntry[]>(
      ALL_PRESS_QUERY,
      {},
      { next: { revalidate: 300, tags: ['press'] } }
    );
    return data.length > 0 ? data : PRESS_MOCK;
  } catch (err) {
    console.error('[sanity] getPress fallback mock:', err);
    return PRESS_MOCK;
  }
}
