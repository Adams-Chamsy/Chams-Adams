import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { rateLimitPerMinute } from '@/lib/rate-limit';
import { sendCarnetReservationEmail } from '@/lib/emails/sendBrandEmails';

const schema = z.object({
  carnet_slug: z.string().min(1).max(120),
  product_slug: z.string().min(1).max(120),
  reserver_email: z.string().email(),
});

/**
 * POST /api/carnets/reserve
 *
 * Permet à un proche (visiteur public) de réserver une pièce du carnet,
 * pour signaler son intention d'offrir et éviter les doublons.
 *
 * Notifie le propriétaire du carnet par email.
 */
export async function POST(req: NextRequest) {
  const rate = rateLimitPerMinute(req, 'carnets-reserve', 10);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Trop de tentatives.' }, { status: 429 });
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
      { error: 'Données invalides.' },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServiceClient();

  // Carnet doit être public + récup propriétaire
  const { data: carnet } = await supabase
    .from('event_carnets')
    .select('id, slug, event_name, user_id')
    .eq('slug', parsed.data.carnet_slug)
    .eq('is_public', true)
    .maybeSingle();
  if (!carnet) {
    return NextResponse.json(
      { error: 'Carnet introuvable.' },
      { status: 404 }
    );
  }

  // Item doit exister et ne pas être déjà réservé
  const { data: item } = await supabase
    .from('event_carnet_items')
    .select('id, reserved_by_email')
    .eq('carnet_id', carnet.id as string)
    .eq('product_slug', parsed.data.product_slug)
    .maybeSingle();
  if (!item) {
    return NextResponse.json(
      { error: 'Pièce introuvable dans ce carnet.' },
      { status: 404 }
    );
  }
  if (item.reserved_by_email) {
    return NextResponse.json(
      { error: 'Cette pièce est déjà réservée.' },
      { status: 409 }
    );
  }

  // Réservation
  const { error } = await supabase
    .from('event_carnet_items')
    .update({
      reserved_by_email: parsed.data.reserver_email,
      reserved_at: new Date().toISOString(),
    })
    .eq('id', item.id as string);
  if (error) {
    console.error('[carnets/reserve]', error);
    return NextResponse.json({ error: 'Erreur.' }, { status: 500 });
  }

  // Email au propriétaire (best-effort)
  try {
    let ownerEmail: string | null = null;
    if (carnet.user_id) {
      const { data: list } = await supabase.auth.admin.listUsers();
      const owner = list?.users.find((u) => u.id === (carnet.user_id as string));
      ownerEmail = owner?.email ?? null;
    }
    const productName = parsed.data.product_slug;
    if (ownerEmail) {
      const { data: product } = await supabase
        .from('products')
        .select('name')
        .eq('slug', parsed.data.product_slug)
        .maybeSingle();
      const friendlyName =
        (product?.name as string | undefined) ?? productName;
      await sendCarnetReservationEmail({
        to: ownerEmail,
        carnetName: carnet.event_name as string,
        carnetSlug: carnet.slug as string,
        productName: friendlyName,
        reservedByEmail: parsed.data.reserver_email,
      });
    }
  } catch (err) {
    console.warn('[carnets/reserve] email skipped:', err);
  }

  return NextResponse.json({ ok: true });
}
