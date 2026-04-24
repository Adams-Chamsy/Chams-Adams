import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { rateLimitHourly } from '@/lib/rate-limit';

const schema = z.object({
  product_id: z.string().uuid().optional().nullable(),
  product_slug: z.string().min(1),
  customer_name: z.string().min(2).max(80),
  customer_email: z.string().email().optional().or(z.literal('')),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional().or(z.literal('')),
  body: z.string().min(20).max(3000),
});

/**
 * POST /api/reviews — soumission publique (modération admin requise).
 * L'avis est créé avec `approved = false` (invisible sur le site public).
 */
export async function POST(req: NextRequest) {
  const rate = rateLimitHourly(req, 'reviews');
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Trop de soumissions récentes. Merci de réessayer dans l’heure.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Données invalides.' },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServiceClient();

  // Résoudre product_id depuis le slug si absent
  let productId = parsed.data.product_id ?? null;
  if (!productId) {
    const { data } = await supabase
      .from('products')
      .select('id')
      .eq('slug', parsed.data.product_slug)
      .maybeSingle();
    productId = (data?.id as string | undefined) ?? null;
  }

  const { error } = await supabase.from('product_reviews').insert({
    product_id: productId,
    customer_name: parsed.data.customer_name,
    customer_email: parsed.data.customer_email || null,
    rating: parsed.data.rating,
    title: parsed.data.title || null,
    body: parsed.data.body,
    approved: false,
  });
  if (error) {
    console.error('[reviews]', error);
    return NextResponse.json({ error: 'Échec de la soumission.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
