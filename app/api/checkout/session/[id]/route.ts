import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

/**
 * GET /api/checkout/session/:id
 * Récupère les infos d'une session Stripe, utilisées sur la page
 * /checkout/success pour afficher le numéro de commande + récap.
 *
 * Ne renvoie que des champs "safe" (pas la session complète).
 */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  if (!id || !id.startsWith('cs_')) {
    return NextResponse.json(
      { error: 'Identifiant de session invalide.' },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(id);

    return NextResponse.json({
      email: session.customer_email ?? session.customer_details?.email ?? null,
      amountTotal: session.amount_total ?? 0,
      currency: (session.currency ?? 'eur').toUpperCase(),
      paymentStatus: session.payment_status,
      // Numéro de commande lisible : les 8 derniers caractères du session ID
      orderNumber: id.slice(-8).toUpperCase(),
    });
  } catch (err) {
    console.error('[session:get] failed:', err);
    return NextResponse.json(
      { error: 'Session introuvable.' },
      { status: 404 }
    );
  }
}
