import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { sendOrderConfirmation } from '@/lib/emails/sendOrderConfirmation';

/**
 * POST /api/webhooks/stripe
 *
 * Webhook Stripe — IMPORTANT :
 *  - Utilise req.text() pour récupérer le body BRUT (nécessaire pour la
 *    vérification de signature). Si on fait req.json(), la re-sérialisation
 *    casse la signature et constructEvent échoue.
 *  - Vérifie OBLIGATOIREMENT la signature avec STRIPE_WEBHOOK_SECRET.
 *  - Retourne 200 le plus vite possible (Stripe retry si timeout > 30s).
 *
 * Pour tester en local :
 *   1. Lancer le tunnel Stripe :
 *      stripe listen --forward-to localhost:3000/api/webhooks/stripe
 *   2. Copier le `whsec_...` affiché dans .env.local (STRIPE_WEBHOOK_SECRET)
 *   3. Relancer le dev server
 *   4. Faire un paiement test avec la carte 4242 4242 4242 4242
 *
 * Events gérés :
 *  - checkout.session.completed  → envoi email de confirmation
 *  - checkout.session.expired    → log
 *  - payment_intent.payment_failed → log
 */
export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    console.error('[webhook] missing signature or secret');
    return NextResponse.json(
      { error: 'Signature ou secret manquant.' },
      { status: 400 }
    );
  }

  // Body brut (nécessaire pour constructEvent)
  const rawBody = await req.text();

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    console.error('[webhook] signature verification failed:', err);
    return NextResponse.json(
      { error: 'Signature invalide.' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutSessionCompleted(stripe, session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        console.info('[webhook] checkout.session.expired', {
          id: session.id,
          email: session.customer_email,
        });
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        console.warn('[webhook] payment_intent.payment_failed', {
          id: pi.id,
          reason: pi.last_payment_error?.message,
        });
        break;
      }

      default:
        // Ignore — on retourne 200 pour que Stripe ne rejoue pas l'event.
        console.info('[webhook] event non traité:', event.type);
    }
  } catch (err) {
    console.error('[webhook] handler failed:', err);
    // 500 → Stripe rejouera l'event (retry exponentiel jusqu'à 3 jours)
    return NextResponse.json(
      { error: 'Traitement en échec.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

async function handleCheckoutSessionCompleted(
  stripe: Stripe,
  session: Stripe.Checkout.Session
) {
  // Récupère les line items (+ prix + produit) pour l'email
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
    expand: ['data.price.product'],
  });

  const items = lineItems.data.map((li) => {
    const product = li.price?.product as Stripe.Product | undefined;
    return {
      name: product?.name ?? 'Pièce',
      description: product?.description ?? '',
      quantity: li.quantity ?? 1,
      unitAmount: li.price?.unit_amount ?? 0,
      currency: (li.price?.currency ?? 'eur').toUpperCase(),
      imageUrl: product?.images?.[0],
    };
  });

  const email = session.customer_email ?? session.customer_details?.email;
  if (!email) {
    console.warn('[webhook] no email on session', session.id);
    return;
  }

  await sendOrderConfirmation({
    to: email,
    orderNumber: session.id,
    orderDate: new Date((session.created ?? Date.now() / 1000) * 1000).toISOString(),
    currency: (session.currency ?? 'eur').toUpperCase(),
    items,
    subtotalCents: session.amount_subtotal ?? 0,
    totalCents: session.amount_total ?? 0,
    shipping: session.shipping_cost?.amount_total ?? null,
    // L'accès à shipping_details a changé selon les versions d'API Stripe.
    // On tente plusieurs sources (defensive) + fallback sur l'adresse
    // de facturation qui, elle, est toujours disponible sur Session.
    shippingAddress:
      (session as unknown as { shipping_details?: { address?: Stripe.Address | null } })
        .shipping_details?.address ??
      (session as unknown as { collected_information?: { shipping_details?: { address?: Stripe.Address | null } } })
        .collected_information?.shipping_details?.address ??
      session.customer_details?.address ??
      null,
    customerName: session.customer_details?.name ?? null,
  });

  console.info('[webhook] order confirmation sent', {
    session: session.id,
    email,
  });

  // TODO(étape 8+) : persister la commande en base (Sanity / DB)
}
