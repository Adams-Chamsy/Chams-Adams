import 'server-only';
import { sanityClient, isSanityEnabled } from '@/lib/sanity/client';
import { ALL_FAQ_QUERY } from '@/lib/sanity/queries';
import { FAQ as FAQ_MOCK, type FAQItem } from './faq.mock';

export type { FAQItem } from './faq.mock';
export { FAQ_CATEGORY_LABELS, groupFAQ, type FAQCategory } from './faq.mock';

/**
 * Charge la FAQ depuis Sanity avec fallback mock.
 * Revalidation ISR : 10 min.
 */
export async function getFAQ(): Promise<FAQItem[]> {
  if (!isSanityEnabled()) return FAQ_MOCK;
  try {
    const data = await sanityClient.fetch<FAQItem[]>(
      ALL_FAQ_QUERY,
      {},
      { next: { revalidate: 600, tags: ['faq'] } }
    );
    return data.length > 0 ? data : FAQ_MOCK;
  } catch (err) {
    console.error('[sanity] getFAQ fallback mock:', err);
    return FAQ_MOCK;
  }
}
