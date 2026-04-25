import { NextRequest, NextResponse } from 'next/server';
import { getStripe, getSiteUrl } from '@/lib/stripe';
import { rateLimitPerMinute } from '@/lib/rate-limit';
import { validatePromoCode } from '@/lib/promos/validate';
import type { CartItem } from '@/lib/store/cart.store';

/**
 * POST /api/checkout
 * Body : { items: CartItem[], email: string }
 * Retour : { url: string } → redirection Stripe Checkout
 *
 * Flow :
 *  1. Validation serveur (items non vide, email, prix > 0)
 *  2. Création d'une session Checkout Stripe (mode payment)
 *     - locale FR, carte + payment_method_types par défaut
 *     - collecte adresse livraison + facturation + téléphone
 *     - success_url vers /checkout/success?session_id=...
 *     - cancel_url retour sur /checkout
 *  3. Retour de l'URL de session — le client redirige
 *
 * Pas de rate limiting en local (à prévoir côté middleware Vercel / Redis
 * en production).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  // 10 tentatives / IP / minute — usage légitime fréquent possible (retry CB)
  const rate = rateLimitPerMinute(req, 'checkout', 10);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Merci de patienter une minute.' },
      { status: 429 }
    );
  }

  let body: { items?: CartItem[]; email?: string; promo_code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide.' }, { status: 400 });
  }

  const { items, email, promo_code } = body;

  // -- Validation
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: 'Votre sélection est vide.' },
      { status: 400 }
    );
  }
  if (items.length > 30) {
    return NextResponse.json({ error: 'Trop de pièces.' }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'Adresse de courriel invalide.' },
      { status: 400 }
    );
  }
  for (const item of items) {
    if (
      typeof item.price !== 'number' ||
      item.price <= 0 ||
      typeof item.quantity !== 'number' ||
      item.quantity <= 0 ||
      item.quantity > 10
    ) {
      return NextResponse.json(
        { error: 'Une pièce est invalide.' },
        { status: 400 }
      );
    }
  }

  const stripe = getStripe();
  const siteUrl = getSiteUrl();

  // -- Promo code (optionnel)
  let stripeDiscounts: { coupon: string }[] | undefined;
  let promoMeta: { code: string; promo_id: string; discount_cents: number } | undefined;
  if (promo_code && typeof promo_code === 'string') {
    const subtotalCents = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const validated = await validatePromoCode(promo_code, subtotalCents);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }
    try {
      const coupon = await stripe.coupons.create({
        amount_off: validated.promo.discount_cents,
        currency: (items[0]?.currency ?? 'EUR').toLowerCase(),
        duration: 'once',
        name: `Code ${validated.promo.code}`,
      });
      stripeDiscounts = [{ coupon: coupon.id }];
      promoMeta = validated.promo;
    } catch (err) {
      console.error('[checkout] coupon create failed:', err);
      return NextResponse.json(
        { error: 'Impossible d\u2019appliquer le code.' },
        { status: 500 }
      );
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      locale: 'fr',
      customer_email: email,
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: item.currency.toLowerCase(),
          unit_amount: item.price, // déjà en cents dans le store
          product_data: {
            name: item.productName,
            description: [item.productSubtitle, `${item.variantColorName} · Taille ${item.size}`]
              .filter(Boolean)
              .join(' — '),
            images: [toAbsoluteUrl(item.image.url, siteUrl)],
            metadata: {
              productId: item.productId,
              variantId: item.variantId,
              size: item.size,
            },
          },
        },
      })),
      ...(stripeDiscounts ? { discounts: stripeDiscounts } : {}),
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
      shipping_address_collection: {
        allowed_countries: [
          'FR', 'BE', 'CH', 'LU', 'GB', 'US', 'CA',
          'SN', 'CI', 'CM', 'ML', 'BF', 'GN', 'BJ', 'TG',
        ],
      },
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      metadata: {
        source: 'chams-adams-web',
        ...(promoMeta
          ? {
              promo_code: promoMeta.code,
              promo_id: promoMeta.promo_id,
              promo_discount_cents: String(promoMeta.discount_cents),
            }
          : {}),
      },
    });

    if (!session.url) {
      throw new Error('Stripe n\u2019a pas retourné d\u2019URL de session.');
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    // Log structuré côté serveur
    console.error('[checkout] stripe session create failed:', err);
    return NextResponse.json(
      { error: 'Impossible de créer la session de paiement.' },
      { status: 500 }
    );
  }
}

function toAbsoluteUrl(path: string, base: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
}
