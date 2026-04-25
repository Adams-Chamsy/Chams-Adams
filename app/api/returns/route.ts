import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { rateLimitHourly } from '@/lib/rate-limit';

const schema = z.object({
  order_id: z.string().min(1).max(120).optional().nullable(),
  email: z.string().email(),
  reason: z.enum([
    'taille',
    'qualite',
    'pas-conforme',
    'changement-avis',
    'defaut',
    'autre',
  ]),
  details: z.string().max(2000).optional().nullable(),
});

/** POST /api/returns — demande de retour publique. */
export async function POST(req: NextRequest) {
  const rate = rateLimitHourly(req, 'returns');
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Trop de demandes. Réessayez plus tard.' },
      { status: 429 }
    );
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
  const { error } = await supabase.from('return_requests').insert({
    order_id: parsed.data.order_id ?? null,
    email: parsed.data.email,
    reason: parsed.data.reason,
    details: parsed.data.details ?? null,
  });
  if (error) {
    console.error('[returns]', error);
    return NextResponse.json(
      { error: 'Échec de l’enregistrement.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
