import 'server-only';
import {
  createSupabaseServerClient,
  isSupabaseEnabled,
} from '@/lib/supabase/server';
import { sanityClient, isSanityEnabled } from '@/lib/sanity/client';
import { ALL_FAQ_QUERY } from '@/lib/sanity/queries';
import { FAQ as FAQ_MOCK, type FAQItem } from './faq.mock';

export type { FAQItem } from './faq.mock';
export { FAQ_CATEGORY_LABELS, groupFAQ, type FAQCategory } from './faq.mock';

/**
 * Loader FAQ — priorité : Supabase → Sanity → mock.
 * Revalidation : 60s (tag `faq` invalidé par l'admin sur chaque mutation).
 */
export async function getFAQ(): Promise<FAQItem[]> {
  // 1. Supabase (source principale une fois l'admin actif)
  if (isSupabaseEnabled()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data } = await supabase
        .from('faq_items')
        .select('id, category, question, answer')
        .eq('published', true)
        .order('category', { ascending: true })
        .order('sort_order', { ascending: true });
      if (data && data.length > 0) {
        return data as FAQItem[];
      }
    } catch (err) {
      console.error('[supabase] getFAQ fallback:', err);
    }
  }

  // 2. Sanity (legacy, à retirer après migration finale)
  if (isSanityEnabled()) {
    try {
      const data = await sanityClient.fetch<FAQItem[]>(
        ALL_FAQ_QUERY,
        {},
        { next: { revalidate: 600, tags: ['faq'] } }
      );
      if (data.length > 0) return data;
    } catch {
      // noop
    }
  }

  // 3. Mock (dev / première install)
  return FAQ_MOCK;
}
