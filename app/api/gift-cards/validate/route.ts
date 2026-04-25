import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateGiftCard } from '@/lib/gift-cards/validate';
import { rateLimitPerMinute } from '@/lib/rate-limit';

const schema = z.object({
  code: z.string().min(1).max(40),
  cart_total_cents: z.number().int().min(0),
});

/** POST /api/gift-cards/validate — vérifie + retourne le montant applicable. */
export async function POST(req: NextRequest) {
  const rate = rateLimitPerMinute(req, 'gift-cards-validate', 30);
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
      { error: parsed.error.issues[0]?.message ?? 'Données invalides.' },
      { status: 400 }
    );
  }

  const result = await validateGiftCard(
    parsed.data.code,
    parsed.data.cart_total_cents
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, ...result.card });
}
