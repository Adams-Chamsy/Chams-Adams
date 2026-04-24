import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { rateLimitHourly } from '@/lib/rate-limit';

const schema = z.object({
  product_slug: z.string().min(1),
  variant_id: z.string().uuid().optional().nullable(),
  size: z.string().optional().nullable(),
  email: z.string().email(),
});

/** POST /api/waitlist — signup "prévenez-moi" pour un produit sold out ou en pré-commande. */
export async function POST(req: NextRequest) {
  const rate = rateLimitHourly(req, 'waitlist');
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Trop de demandes, réessayez plus tard.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON invalide.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Données invalides.' },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServiceClient();
  const { data: product } = await supabase
    .from('products')
    .select('id')
    .eq('slug', parsed.data.product_slug)
    .maybeSingle();

  // Upsert-like : ignore si déjà présent pour (product, email, variant, size)
  const { error } = await supabase.from('waitlist_entries').insert({
    product_id: (product?.id as string | undefined) ?? null,
    product_slug: parsed.data.product_slug,
    email: parsed.data.email,
    variant_id: parsed.data.variant_id ?? null,
    size: parsed.data.size ?? null,
  });

  // Ignorer erreur d'unique violation (code Postgres 23505)
  if (error && !error.message.includes('duplicate')) {
    console.error('[waitlist]', error);
    return NextResponse.json({ error: 'Échec de l’inscription.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
