import 'server-only';
import {
  createSupabaseServerClient,
  isSupabaseEnabled,
} from '@/lib/supabase/server';
import { FAQ as FAQ_MOCK, type FAQItem } from './faq.mock';

export type { FAQItem } from './faq.mock';
export { FAQ_CATEGORY_LABELS, groupFAQ, type FAQCategory } from './faq.mock';

/** Loader FAQ — Supabase avec fallback mock. */
export async function getFAQ(): Promise<FAQItem[]> {
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
  return FAQ_MOCK;
}
