import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const upsertSchema = z.object({
  product_slugs: z.array(z.string().min(1).max(120)).max(200),
});

/**
 * GET /api/wishlist — renvoie les slugs en wishlist du user authentifié.
 * Auth obligatoire — RLS filtre par auth.uid().
 */
export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ slugs: [] }, { status: 200 });
  }

  const { data } = await supabase
    .from('wishlists')
    .select('product_id, product:products(slug)')
    .eq('user_id', user.id);

  const slugs =
    (data ?? [])
      .map(
        (r) =>
          (r as unknown as { product?: { slug?: string } | null }).product
            ?.slug
      )
      .filter((s): s is string => typeof s === 'string');

  return NextResponse.json({ slugs });
}

/**
 * POST /api/wishlist — réconcilie les slugs locaux avec la BDD.
 * Body : { product_slugs: string[] }
 * Stratégie : upsert (slug → product_id), pas de suppression côté serveur ici.
 */
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

  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides.' },
      { status: 400 }
    );
  }

  if (parsed.data.product_slugs.length === 0) {
    return NextResponse.json({ ok: true, added: 0 });
  }

  // Lookup product IDs par slug
  const { data: products } = await supabase
    .from('products')
    .select('id, slug')
    .in('slug', parsed.data.product_slugs);

  const rows =
    (products ?? []).map((p) => ({
      user_id: user.id,
      product_id: p.id as string,
    })) ?? [];

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, added: 0 });
  }

  // upsert via unique(user_id, product_id) — ignore les doublons
  const { error } = await supabase
    .from('wishlists')
    .upsert(rows, { onConflict: 'user_id,product_id', ignoreDuplicates: true });
  if (error) {
    console.error('[wishlist] upsert', error);
    return NextResponse.json({ error: 'Erreur.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, added: rows.length });
}

const deleteSchema = z.object({
  product_slug: z.string().min(1).max(120),
});

/**
 * DELETE /api/wishlist — retire un produit de la wishlist server-side.
 * Body : { product_slug }
 */
export async function DELETE(req: NextRequest) {
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

  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides.' },
      { status: 400 }
    );
  }

  const { data: product } = await supabase
    .from('products')
    .select('id')
    .eq('slug', parsed.data.product_slug)
    .maybeSingle();
  if (!product) {
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', product.id);
  if (error) {
    console.error('[wishlist] delete', error);
    return NextResponse.json({ error: 'Erreur.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
