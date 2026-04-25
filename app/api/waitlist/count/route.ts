import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

const schema = z.object({
  product_slug: z.string().min(1).max(120),
  size: z.string().max(20).optional().nullable(),
});

/**
 * GET /api/waitlist/count?product_slug=xxx&size=M
 * Retourne le nombre de personnes inscrites en attente (notified_at IS NULL).
 *
 * Usage : preuve sociale discrète sur fiche produit / waitlist form.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = schema.safeParse({
    product_slug: url.searchParams.get('product_slug'),
    size: url.searchParams.get('size'),
  });
  if (!parsed.success) {
    return NextResponse.json({ count: 0 }, { status: 200 });
  }

  const supabase = createSupabaseServiceClient();
  let q = supabase
    .from('waitlist_entries')
    .select('id', { count: 'exact', head: true })
    .eq('product_slug', parsed.data.product_slug)
    .is('notified_at', null);
  if (parsed.data.size) q = q.eq('size', parsed.data.size);

  const { count } = await q;
  return NextResponse.json({ count: count ?? 0 });
}
