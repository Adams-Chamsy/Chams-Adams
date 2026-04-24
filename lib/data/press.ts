import 'server-only';
import {
  createSupabaseServerClient,
  isSupabaseEnabled,
} from '@/lib/supabase/server';
import { sanityClient, isSanityEnabled } from '@/lib/sanity/client';
import { ALL_PRESS_QUERY } from '@/lib/sanity/queries';
import { PRESS as PRESS_MOCK, type PressEntry } from './press.mock';

export type { PressEntry } from './press.mock';
export { sortPressByDate } from './press.mock';

/** Loader Presse — Supabase → Sanity → mock. */
export async function getPress(): Promise<PressEntry[]> {
  if (isSupabaseEnabled()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data } = await supabase
        .from('press_entries')
        .select(
          'id, publication, logo_text, published_at, title, excerpt, article_url, featured'
        )
        .order('published_at', { ascending: false });
      if (data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          publication: row.publication,
          logoText: row.logo_text ?? row.publication,
          date: row.published_at,
          title: row.title,
          excerpt: row.excerpt ?? '',
          articleUrl: row.article_url ?? undefined,
          featured: row.featured ?? false,
        }));
      }
    } catch (err) {
      console.error('[supabase] getPress fallback:', err);
    }
  }

  if (isSanityEnabled()) {
    try {
      const data = await sanityClient.fetch<PressEntry[]>(
        ALL_PRESS_QUERY,
        {},
        { next: { revalidate: 300, tags: ['press'] } }
      );
      if (data.length > 0) return data;
    } catch {
      // noop
    }
  }

  return PRESS_MOCK;
}
