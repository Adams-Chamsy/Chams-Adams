import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * GET /api/carnets — liste les carnets du user authentifié.
 * Retour : [{ id, slug, event_name, event_type }]
 *
 * POST /api/carnets — ajoute un produit à un carnet existant.
 * Body : { carnet_slug, product_slug }
 */
export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ carnets: [] }, { status: 200 });

  const { data } = await supabase
    .from('event_carnets')
    .select('id, slug, event_name, event_type')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return NextResponse.json({ carnets: data ?? [] });
}

const addSchema = z.object({
  carnet_slug: z.string().min(1).max(120),
  product_slug: z.string().min(1).max(120),
});

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: 'Non authentifié.' },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON invalide.' }, { status: 400 });
  }

  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides.' },
      { status: 400 }
    );
  }

  const { data: carnet } = await supabase
    .from('event_carnets')
    .select('id')
    .eq('slug', parsed.data.carnet_slug)
    .eq('user_id', user.id)
    .maybeSingle();
  if (!carnet) {
    return NextResponse.json(
      { error: 'Carnet introuvable.' },
      { status: 404 }
    );
  }

  const { data: product } = await supabase
    .from('products')
    .select('id')
    .eq('slug', parsed.data.product_slug)
    .maybeSingle();

  const { error } = await supabase.from('event_carnet_items').upsert(
    {
      carnet_id: carnet.id as string,
      product_id: (product?.id as string | undefined) ?? null,
      product_slug: parsed.data.product_slug,
    },
    { onConflict: 'carnet_id,product_slug', ignoreDuplicates: true }
  );
  if (error) {
    console.error('[carnets/add]', error);
    return NextResponse.json({ error: 'Erreur.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
